import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useRef, useState } from 'react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { updateUserStart, updateUserSuccess, updateUserFailure, deleteUserFailure, deleteUserStart, deleteUserSuccess } from '../redux/user/userSlice';

const Profile = () => {
  
  const [image, setImage] = useState(undefined);
  const [imageError, setImageError] = useState(false);
  const [imagePercent, setImagePercent] = useState(0);
  const [formData, setFormData] = useState({})
  const [updateSuccess, setupdateSuccess] = useState(false);

  const { currentUser, loading, error } = useSelector(state => state.user);
  const dispatch = useDispatch();
  
  const fileRef = useRef(null);


  // HANDLING FILE UPLOADS ----------------------------------------------------------------
  const handleFileUpload = async () => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + image.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImagePercent(Math.round(progress));
      },
      (error) => setImageError(true),
      () => {
        getDownloadURL(uploadTask.snapshot.ref)
          .then((downloadURL) => setFormData({
            ...formData,
            profilePicture: downloadURL
          }));
      }
    );
  };


  useEffect(() => {
    if (image) {
      handleFileUpload(image);
    }
  }, [image]);



  // HANDLE INPUT CHANGES ----------------------------------------------------------------
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  }


  // SAVE / CREATE ----------------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());

      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data));
        return;
      }
      dispatch(updateUserSuccess(data));
      setupdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error));
    }
  }


  // DELETE ----------------------------------------------------------------
  const handleDeleteAccount = async () => {
    try {
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error));
    }
  }


  
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          type="file"
          ref={fileRef}
          hidden
          accept='image/*'
          onChange={e => setImage(e.target.files[0])}
        />
        {/* Firebase Image Rules
        ************************* 
        service firebase.storage {
          match /b/{bucket}/o {
              match /{allPaths=**} {
                allow read;
                allow write: if 
                  request.resource.size < 2 * 1024 * 1024 && request.resource.contentType.matches('image/.*')
              }
            }
          } */}
        <img
          src={formData.profilePicture || currentUser.profilePicture}
          alt="profile"
          onClick={() => fileRef.current.click()}
          className='mt-2 h-24 w-24 self-center cursor-pointer rounded-full object-cover'
        />
        <p className='text-sm self-center'>
          {
            imageError
              ? <span className='text-red-700'>Error uploading image (file size must be less than 2 MB)</span>
              : imagePercent > 0 && imagePercent < 100
                ? <span className='text-slate-700'>{`Uploading: ${imagePercent} %`}</span>
                : imagePercent === 100
                  ? <span className='text-green-700'>Image uploaded successfully</span>
                  : ''
          }
        </p>
        <input
          type="text"
          id="username"
          defaultValue={currentUser.username}
          onChange={handleChange}
          placeholder='Username'
          className='bg-slate-100 rounded-lg p-3'
        />
        <input
          type="email"
          id="email"
          defaultValue={currentUser.email}
          onChange={handleChange}
          placeholder='Email'
          className='bg-slate-100 rounded-lg p-3'
        />
        <input
          type="password"
          id="password"
          onChange={handleChange}
          placeholder='Password'
          className='bg-slate-100 rounded-lg p-3'
        />
        <button
          className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
          {loading ? "Loading..." : "Update"}
        </button>
      </form>
      <div className='flex justify-between mt-5'>
        <span onClick={handleDeleteAccount} className='text-red-700 cursor-pointer'>Delete Account</span>
        <span className='text-red-700 cursor-pointer'>Sign out</span>
      </div>
      <p className='text-red-700 mt-5'>{error && 'Something went wrong!'}</p>
      <p className='text-green-700 mt-5'>{updateSuccess && 'User is updated successfully!'}</p>
    </div>
  )
}

export default Profile
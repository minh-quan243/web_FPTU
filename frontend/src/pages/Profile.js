import { useEffect, useState } from 'react';

import axios from '../utils/axiosInstance';

import './Profile.css';

function Profile() {

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    address: '',
    phone: '',
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
  });

  // LOAD PROFILE
  useEffect(() => {

    const fetchProfile = async () => {

      try {

        const res = await axios.get('/profile');

        setProfile(res.data);

      } catch (err) {

        console.log(err);

      }
    };

    fetchProfile();

  }, []);

  // UPDATE PROFILE
  const handleUpdateProfile = async (e) => {

    e.preventDefault();

    try {

      await axios.put('/profile', {

        name: profile.name,

        address: profile.address,

        phone: profile.phone,

      });

      alert('Profile updated');

    } catch (err) {

      console.log(err);

      alert('Update failed');

    }
  };

  // CHANGE PASSWORD
  const handleChangePassword = async (e) => {

    e.preventDefault();

    try {

      await axios.put(

        '/profile/password',

        passwordData
      );

      alert('Password changed');

      setPasswordData({

        oldPassword: '',

        newPassword: '',

      });

    } catch (err) {

      console.log(err);

      alert('Password change failed');

    }
  };

  // LOGOUT
  const handleLogout = () => {

    localStorage.removeItem('token');

    localStorage.removeItem('refreshToken');

    localStorage.removeItem('role');

    window.location.href = '/login';
  };

  return (

    <div className="profile-container">

      <h1>My Profile</h1>

      {/* PROFILE FORM */}

      <form
        className="profile-form"
        onSubmit={handleUpdateProfile}
      >

        <input
          type="text"
          placeholder="Name"
          value={profile.name}
          onChange={(e) =>
            setProfile({
              ...profile,
              name: e.target.value,
            })
          }
        />

        <input
          type="email"
          placeholder="Email"
          value={profile.email}
          disabled
        />

        <input
          type="text"
          placeholder="Address"
          value={profile.address || ''}
          onChange={(e) =>
            setProfile({
              ...profile,
              address: e.target.value,
            })
          }
        />

        <input
          type="text"
          placeholder="Phone"
          value={profile.phone || ''}
          onChange={(e) =>
            setProfile({
              ...profile,
              phone: e.target.value,
            })
          }
        />

        <button type="submit">
          Update Profile
        </button>

      </form>

      {/* PASSWORD FORM */}

      <form
        className="password-form"
        onSubmit={handleChangePassword}
      >

        <h2>Change Password</h2>

        <input
          type="password"
          placeholder="Old Password"
          value={passwordData.oldPassword}
          onChange={(e) =>
            setPasswordData({
              ...passwordData,
              oldPassword: e.target.value,
            })
          }
        />

        <input
          type="password"
          placeholder="New Password"
          value={passwordData.newPassword}
          onChange={(e) =>
            setPasswordData({
              ...passwordData,
              newPassword: e.target.value,
            })
          }
        />

        <button type="submit">
          Change Password
        </button>

      </form>

      <button
        className="logout-btn"
        onClick={handleLogout}
      >
        Logout
      </button>

    </div>
  );
}

export default Profile;
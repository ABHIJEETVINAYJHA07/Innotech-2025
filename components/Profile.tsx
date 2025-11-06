import React, { useState, useEffect } from 'react';
import { User, View } from '../types';
import { UserIcon, DocumentAddIcon, LightBulbIcon, LogoutIcon, ArrowRightIcon, CloudUploadIcon, CameraIcon } from './Icons';

interface ProfileProps {
  user: User | null;
  onNavigate: (view: View) => void;
  onSignOut: () => void;
  onUpdateProfile: (updatedUser: User) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onNavigate, onSignOut, onUpdateProfile }) => {
  const [address, setAddress] = useState(user?.address || '');
  const [addressProof, setAddressProof] = useState<File | null>(null);
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string | null>(user?.profilePhoto || null);
  const [email, setEmail] = useState(user?.email || '');
  const [alternateMobile, setAlternateMobile] = useState(user?.alternateMobileNumber || '');
  const [age, setAge] = useState(user?.age?.toString() || '');
  const [gender, setGender] = useState(user?.gender || '');


  if (!user) {
    return (
      <div className="text-center p-8">
        <p>Loading user profile...</p>
      </div>
    );
  }
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fileType: 'address' | 'profile') => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (fileType === 'address') {
        setAddressProof(file);
      } else {
        setProfilePhoto(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setProfilePhotoPreview(reader.result as string);
        }
        reader.readAsDataURL(file);
      }
    }
  };

  const handleProfileUpdate = () => {
    if (!user) return;
    const updatedUser: User = {
      ...user,
      address,
      addressProof: addressProof ? addressProof.name : user.addressProof,
      profilePhoto: profilePhotoPreview || user.profilePhoto,
      email,
      alternateMobileNumber: alternateMobile,
      age: age ? parseInt(age) : undefined,
      gender,
    };
    onUpdateProfile(updatedUser);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Profile Header */}
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
            <div className="w-28 h-28 bg-gradient-to-br from-rose-500 to-orange-500 rounded-full flex items-center justify-center text-white text-4xl font-bold overflow-hidden p-1">
                <div className="w-full h-full bg-white rounded-full flex items-center justify-center text-slate-800">
                   {profilePhotoPreview ? (
                        <img src={profilePhotoPreview} alt="Profile" className="w-full h-full object-cover rounded-full" />
                    ) : (
                        <span>{getInitials(user.fullName)}</span>
                    )}
                </div>
            </div>
            <label htmlFor="profilePhoto" className="absolute -bottom-1 -right-1 bg-slate-200 p-2 rounded-full shadow-md cursor-pointer hover:bg-slate-300 transition-colors border-2 border-stone-100">
                <CameraIcon className="w-5 h-5 text-rose-500" />
                <input id="profilePhoto" type="file" className="sr-only" onChange={(e) => handleFileChange(e, 'profile')} accept="image/*" />
            </label>
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900">{user.fullName}</h2>
          <p className="text-slate-500">@{user.username}</p>
          <p className="text-slate-600">{user.mobileNumber}</p>
        </div>
      </div>
      
      {/* My Information Section */}
      <div className="bg-white/60 backdrop-blur-lg border border-black/10 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">My Information</h3>
        <div className="space-y-4">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-600 mb-1">Email Address</label>
              <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-slate-100/50 shadow-sm appearance-none border border-slate-300 rounded-lg w-full py-2 px-3 text-slate-800 leading-tight focus:outline-none focus:ring-2 focus:ring-rose-500" placeholder="your.email@example.com" />
            </div>
            <div>
              <label htmlFor="alternateMobile" className="block text-sm font-medium text-slate-600 mb-1">Alternate Mobile</label>
              <input type="tel" id="alternateMobile" value={alternateMobile} onChange={(e) => setAlternateMobile(e.target.value)} className="bg-slate-100/50 shadow-sm appearance-none border border-slate-300 rounded-lg w-full py-2 px-3 text-slate-800 leading-tight focus:outline-none focus:ring-2 focus:ring-rose-500" placeholder="Optional contact number" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-slate-600 mb-1">Age</label>
              <input type="number" id="age" value={age} onChange={(e) => setAge(e.target.value)} className="bg-slate-100/50 shadow-sm appearance-none border border-slate-300 rounded-lg w-full py-2 px-3 text-slate-800 leading-tight focus:outline-none focus:ring-2 focus:ring-rose-500" placeholder="e.g., 30" />
            </div>
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-slate-600 mb-1">Gender</label>
              <select id="gender" value={gender} onChange={(e) => setGender(e.target.value)} className="bg-slate-100/50 shadow-sm appearance-none border border-slate-300 rounded-lg w-full py-2 px-3 text-slate-800 leading-tight focus:outline-none focus:ring-2 focus:ring-rose-500">
                <option value="">Select Gender</option>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>
          </div>
          
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-slate-600 mb-1">Address</label>
            <textarea
              id="address"
              rows={3}
              className="bg-slate-100/50 shadow-sm appearance-none border border-slate-300 rounded-lg w-full py-2 px-3 text-slate-800 leading-tight focus:outline-none focus:ring-2 focus:ring-rose-500"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="123, Main Street, Village, District, State - 123456"
            />
          </div>
           <div>
              <label htmlFor="addressProof" className="block text-sm font-medium text-slate-600 mb-1">Address Proof</label>
               <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-400 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <CloudUploadIcon className="mx-auto h-12 w-12 text-slate-400" />
                  <div className="flex text-sm text-slate-500">
                    <label htmlFor="addressProof" className="relative cursor-pointer bg-transparent rounded-md font-medium text-rose-600 hover:text-rose-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-white focus-within:ring-rose-500">
                      <span>Upload a file</span>
                      <input id="addressProof" name="addressProof" type="file" className="sr-only" onChange={(e) => handleFileChange(e, 'address')} accept="image/*,.pdf" />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-slate-500">PNG, JPG, PDF up to 5MB</p>
                </div>
              </div>
              {(addressProof || user.addressProof) && (
                <p className="text-sm text-slate-500 mt-2">
                  Current file: {addressProof ? addressProof.name : user.addressProof}
                </p>
              )}
          </div>
          <button
            onClick={handleProfileUpdate}
            className="w-full bg-gradient-to-r from-teal-500 to-sky-600 text-white font-bold py-2 px-4 rounded-lg shadow-sm hover:from-teal-600 hover:to-sky-700 transition-all duration-300"
          >
            Save Changes
          </button>
        </div>
      </div>


      {/* Navigation Links */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-800 text-center">Quick Links</h3>
        <div className="bg-white/60 backdrop-blur-lg border border-black/10 p-2 rounded-2xl divide-y divide-slate-200">
          <button onClick={() => onNavigate('dashboard')} className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-200/50 rounded-t-xl transition-colors">
            <div className="flex items-center space-x-4">
              <UserIcon className="w-6 h-6 text-rose-500" />
              <span className="font-semibold text-slate-800">My Dashboard</span>
            </div>
            <ArrowRightIcon className="w-5 h-5 text-slate-500" />
          </button>
          <button onClick={() => onNavigate('apply')} className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-200/50 transition-colors">
            <div className="flex items-center space-x-4">
              <DocumentAddIcon className="w-6 h-6 text-green-500" />
              <span className="font-semibold text-slate-800">Apply for Loan</span>
            </div>
            <ArrowRightIcon className="w-5 h-5 text-slate-500" />
          </button>
          <button onClick={() => onNavigate('literacy')} className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-200/50 rounded-b-xl transition-colors">
            <div className="flex items-center space-x-4">
              <LightBulbIcon className="w-6 h-6 text-sky-500" />
              <span className="font-semibold text-slate-800">Financial Learning</span>
            </div>
            <ArrowRightIcon className="w-5 h-5 text-slate-500" />
          </button>
        </div>
      </div>

      {/* Sign Out Button */}
      <div>
        <button 
          onClick={onSignOut} 
          className="w-full bg-gradient-to-r from-red-600 to-pink-700 text-white font-bold py-3 px-4 rounded-lg shadow-sm hover:from-red-700 hover:to-pink-800 transition-all duration-300 flex items-center justify-center space-x-2"
        >
          <LogoutIcon className="w-5 h-5"/>
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Profile;
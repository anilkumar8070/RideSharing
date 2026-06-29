import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Save, Bell } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { useTheme } from '../contexts/ThemeContext';

const Settings = () => {
  const [preferences, setPreferences] = useState({
    smoking: 'no-preference',
    conversation: 'no-preference',
    music: 'no-preference',
    genderPreference: 'any',
    petFriendly: false
  });

  const [notifications, setNotifications] = useState({
    matchNotifications: true,
    emailNotifications: true,
    pushNotifications: true
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { colors } = useTheme();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await api.get('/users/me');
      if (res.data.success) {
        setPreferences(res.data.data.preferences);
        setNotifications(res.data.data.notificationSettings);
      }
    } catch (err) {
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handlePreferenceChange = (field, value) => {
    setPreferences(prev => ({...prev, [field]: value}));
  };

  const handleNotificationChange = (field) => {
    setNotifications(prev => ({...prev, [field]: !prev[field]}));
  };

  const savePreferences = async () => {
    try {
      setSaving(true);
      const res = await api.patch('/users/preferences', preferences);
      if (res.data.success) {
        toast.success('Preferences saved');
      }
    } catch (err) {
      toast.error('Failed to save preferences');
    } finally {
      setSaving(false);
    }
  };

  const saveNotifications = async () => {
    try {
      setSaving(true);
      const res = await api.patch('/users/notification-settings', notifications);
      if (res.data.success) {
        toast.success('Notification settings saved');
      }
    } catch (err) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="page-shell flex items-center justify-center transition-colors" 
           style={{ backgroundColor: colors.bg.secondary, color: colors.text.primary }}>Loading...</div>;
  }

  return (
    <div className="page-shell transition-colors" 
         style={{ backgroundColor: colors.bg.secondary, color: colors.text.primary }}>
      <div className="page-inner max-w-3xl">
        <p className="mb-2 text-sm font-extrabold uppercase" style={{ color: colors.primary }}>Preferences</p>
        <h1 className="text-3xl font-extrabold mb-2 flex items-center gap-2">
          <SettingsIcon style={{ color: colors.primary }} size={32} />
          Settings & Preferences
        </h1>
        <p className="mb-8" style={{ color: colors.text.secondary }}>Customize your ride experience</p>

        {/* Ride Preferences */}
        <div className="surface rounded-2xl p-6 mb-6 transition-colors" 
             style={{ backgroundColor: colors.bg.primary, borderColor: colors.border }}>
          <h2 className="text-xl font-extrabold mb-6" style={{ color: colors.text.primary }}>Ride Preferences</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: colors.text.secondary }}>Smoking</label>
              <select
                value={preferences.smoking}
                onChange={(e) => handlePreferenceChange('smoking', e.target.value)}
                className="field"
                style={{ backgroundColor: colors.bg.tertiary, borderColor: colors.border, color: colors.text.primary }}
              >
                <option value="no-preference">No Preference</option>
                <option value="smoker">Smoker</option>
                <option value="non-smoker">Non-Smoker</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: colors.text.secondary }}>Conversation</label>
              <select
                value={preferences.conversation}
                onChange={(e) => handlePreferenceChange('conversation', e.target.value)}
                className="field"
                style={{ backgroundColor: colors.bg.tertiary, borderColor: colors.border, color: colors.text.primary }}
              >
                <option value="no-preference">No Preference</option>
                <option value="quiet">Quiet</option>
                <option value="chatty">Chatty</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: colors.text.secondary }}>Music</label>
              <select
                value={preferences.music}
                onChange={(e) => handlePreferenceChange('music', e.target.value)}
                className="field"
                style={{ backgroundColor: colors.bg.tertiary, borderColor: colors.border, color: colors.text.primary }}
              >
                <option value="no-preference">No Preference</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: colors.text.secondary }}>Gender Preference</label>
              <select
                value={preferences.genderPreference}
                onChange={(e) => handlePreferenceChange('genderPreference', e.target.value)}
                className="field"
                style={{ backgroundColor: colors.bg.tertiary, borderColor: colors.border, color: colors.text.primary }}
              >
                <option value="any">Any</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium" style={{ color: colors.text.secondary }}>Pet Friendly</label>
              <input
                type="checkbox"
                checked={preferences.petFriendly}
                onChange={(e) => handlePreferenceChange('petFriendly', e.target.checked)}
                className="w-5 h-5 cursor-pointer"
              />
            </div>

            <button
              onClick={savePreferences}
              disabled={saving}
              className="primary-button w-full mt-4 disabled:opacity-50"
            >
              <Save size={18} />
              Save Preferences
            </button>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="surface rounded-2xl p-6 transition-colors" 
             style={{ backgroundColor: colors.bg.primary, borderColor: colors.border }}>
          <h2 className="text-xl font-extrabold mb-6 flex items-center gap-2" style={{ color: colors.text.primary }}>
            <Bell size={20} style={{ color: colors.primary }} />
            Notification Settings
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg" 
                 style={{ backgroundColor: colors.bg.tertiary }}>
              <div>
                <p className="font-medium" style={{ color: colors.text.primary }}>Match Notifications</p>
                <p className="text-sm" style={{ color: colors.text.tertiary }}>Get alerts when new matches are found</p>
              </div>
              <input
                type="checkbox"
                checked={notifications.matchNotifications}
                onChange={() => handleNotificationChange('matchNotifications')}
                className="w-5 h-5 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg" 
                 style={{ backgroundColor: colors.bg.tertiary }}>
              <div>
                <p className="font-medium" style={{ color: colors.text.primary }}>Email Notifications</p>
                <p className="text-sm" style={{ color: colors.text.tertiary }}>Receive updates via email</p>
              </div>
              <input
                type="checkbox"
                checked={notifications.emailNotifications}
                onChange={() => handleNotificationChange('emailNotifications')}
                className="w-5 h-5 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg" 
                 style={{ backgroundColor: colors.bg.tertiary }}>
              <div>
                <p className="font-medium" style={{ color: colors.text.primary }}>Push Notifications</p>
                <p className="text-sm" style={{ color: colors.text.tertiary }}>Get push alerts on your device</p>
              </div>
              <input
                type="checkbox"
                checked={notifications.pushNotifications}
                onChange={() => handleNotificationChange('pushNotifications')}
                className="w-5 h-5 cursor-pointer"
              />
            </div>

            <button
              onClick={saveNotifications}
              disabled={saving}
              className="primary-button w-full mt-4 disabled:opacity-50"
            >
              <Save size={18} />
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;

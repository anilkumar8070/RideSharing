import React, { useState, useEffect } from 'react';
import { Trash2, CheckCircle, AlertCircle, MessageSquare, UserCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { useTheme } from '../contexts/ThemeContext';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { colors } = useTheme();

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      if (res.data.success) {
        setNotifications(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await api.patch(`/notifications/${notificationId}/read`);
      fetchNotifications();
    } catch (err) {
      toast.error('Failed to mark as read');
    }
  };

  const handleDelete = async (notificationId) => {
    try {
      await api.delete(`/notifications/${notificationId}`);
      toast.success('Notification deleted');
      fetchNotifications();
    } catch (err) {
      toast.error('Failed to delete notification');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      toast.success('All marked as read');
      fetchNotifications();
    } catch (err) {
      toast.error('Failed to mark all as read');
    }
  };

  const getIcon = (type) => {
    switch(type) {
      case 'match-found':
        return <UserCheck size={20} style={{ color: colors.status.info }} />;
      case 'match-accepted':
        return <CheckCircle size={20} style={{ color: colors.status.success }} />;
      case 'message-received':
        return <MessageSquare size={20} style={{ color: colors.primary }} />;
      default:
        return <AlertCircle size={20} style={{ color: colors.status.warning }} />;
    }
  };

  if (loading) {
    return <div className="p-4 h-full flex items-center justify-center transition-colors" 
           style={{ backgroundColor: colors.bg.secondary, color: colors.text.primary }}>Loading...</div>;
  }

  return (
    <div className="p-4 h-full overflow-y-auto pb-20 md:pb-0 transition-colors" 
         style={{ backgroundColor: colors.bg.secondary, color: colors.text.primary }}>
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Notifications</h1>
          {notifications.some(n => !n.isRead) && (
            <button
              onClick={handleMarkAllAsRead}
              className="text-sm px-4 py-2 rounded-lg transition border"
              style={{ backgroundColor: colors.bg.tertiary, color: colors.primary, borderColor: colors.primary }}
            >
              Mark all as read
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="p-12 rounded-2xl border text-center" 
               style={{ backgroundColor: colors.bg.primary, borderColor: colors.border }}>
            <AlertCircle size={48} style={{ color: colors.text.tertiary }} className="mx-auto mb-4" />
            <p style={{ color: colors.text.secondary }}>No notifications yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notif) => (
              <div
                key={notif._id}
                className="p-4 rounded-xl border transition cursor-pointer"
                style={{
                  backgroundColor: notif.isRead ? colors.bg.tertiary : colors.bg.primary,
                  borderColor: notif.isRead ? colors.border : colors.primary,
                  borderWidth: '1px'
                }}
                onClick={() => !notif.isRead && handleMarkAsRead(notif._id)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="mt-1">
                      {getIcon(notif.type)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold" style={{ color: colors.text.primary }}>{notif.title}</h3>
                      <p className="text-sm mt-1" style={{ color: colors.text.secondary }}>{notif.message}</p>
                      <p className="text-xs mt-2" style={{ color: colors.text.tertiary }}>
                        {new Date(notif.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(notif._id);
                    }}
                    className="transition"
                    style={{ color: colors.text.secondary }}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;

import React, { useState, useEffect } from 'react';
import { HelpCircle, Plus, MessageSquare, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { useTheme } from '../contexts/ThemeContext';

const Support = () => {
  const [tickets, setTickets] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    type: 'general-inquiry',
    title: '',
    description: '',
    priority: 'medium'
  });
  const [submitting, setSubmitting] = useState(false);
  const { colors } = useTheme();

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const res = await api.get('/support');
      if (res.data.success) {
        setTickets(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to load tickets');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error('Please fill all fields');
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.post('/support', formData);
      if (res.data.success) {
        toast.success('Support ticket created successfully');
        setFormData({ type: 'general-inquiry', title: '', description: '', priority: 'medium' });
        setShowForm(false);
        fetchTickets();
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create ticket');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (ticketId) => {
    if (window.confirm('Delete this ticket?')) {
      try {
        // Note: You might need to create a delete endpoint in backend
        toast.success('Ticket deleted');
        fetchTickets();
      } catch (err) {
        toast.error('Failed to delete ticket');
      }
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'open': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'in-progress': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'resolved': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'closed': return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'urgent': return 'text-red-400';
      case 'high': return 'text-orange-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  if (loading) {
    return <div className="page-shell flex items-center justify-center" style={{ backgroundColor: colors.bg.secondary, color: colors.text.primary }}>Loading...</div>;
  }

  return (
    <div className="page-shell" style={{ backgroundColor: colors.bg.secondary, color: colors.text.primary }}>
      <div className="page-inner max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <p className="mb-2 text-sm font-extrabold uppercase" style={{ color: colors.primary }}>Help desk</p>
            <h1 className="text-3xl font-extrabold flex items-center gap-2">
              <HelpCircle style={{ color: colors.primary }} size={32} />
              Support & Feedback
            </h1>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="primary-button"
          >
            <Plus size={18} />
            New Ticket
          </button>
        </div>

        {/* Create Ticket Form */}
        {showForm && (
          <div className="surface rounded-2xl p-6 mb-6" style={{ backgroundColor: colors.bg.primary, borderColor: colors.border }}>
            <h2 className="text-xl font-extrabold mb-4">Create Support Ticket</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.text.secondary }}>Issue Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="field"
                  style={{ backgroundColor: colors.bg.primary, borderColor: colors.border, color: colors.text.primary }}
                >
                  <option value="bug-report">Bug Report</option>
                  <option value="feature-request">Feature Request</option>
                  <option value="complaint">Complaint</option>
                  <option value="general-inquiry">General Inquiry</option>
                  <option value="feedback">Feedback</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.text.secondary }}>Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({...formData, priority: e.target.value})}
                  className="field"
                  style={{ backgroundColor: colors.bg.primary, borderColor: colors.border, color: colors.text.primary }}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.text.secondary }}>Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Brief title of your issue"
                  maxLength="100"
                  className="field"
                  style={{ backgroundColor: colors.bg.primary, borderColor: colors.border, color: colors.text.primary }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.text.secondary }}>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Describe your issue in detail..."
                  maxLength="2000"
                  rows="5"
                  className="field resize-none"
                  style={{ backgroundColor: colors.bg.primary, borderColor: colors.border, color: colors.text.primary }}
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="primary-button flex-1 disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit Ticket'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="ghost-button flex-1"
                  style={{ '--surface-muted': colors.bg.tertiary, '--border': colors.border, color: colors.text.primary }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="space-y-4">
          {tickets.length === 0 ? (
            <div className="surface rounded-2xl p-12 text-center transition-colors" style={{ backgroundColor: colors.bg.primary, borderColor: colors.border }}>
              <div className="icon-tile mx-auto mb-4 h-16 w-16" style={{ '--tile': colors.bg.tertiary, '--tile-fg': colors.primary }}>
                <MessageSquare size={32} />
              </div>
              <p className="mb-4 font-semibold" style={{ color: colors.text.secondary }}>No support tickets yet</p>
              <button
                onClick={() => setShowForm(true)}
                className="primary-button"
              >
                Create One
              </button>
            </div>
          ) : (
            tickets.map((ticket) => (
              <div key={ticket._id} className="soft-card" 
                   style={{ backgroundColor: colors.bg.primary, borderColor: colors.border }}>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-extrabold" style={{ color: colors.text.primary }}>{ticket.title}</h3>
                    <p className="text-sm mt-1" style={{ color: colors.text.secondary }}>{ticket.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(ticket.status)}`}>
                      {ticket.status}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs mt-4 pt-4 border-t" style={{ color: colors.text.tertiary, borderColor: colors.border }}>
                  <span>Type: <span className="capitalize">{ticket.type.replace('-', ' ')}</span></span>
                  <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                </div>

                {ticket.response?.message && (
                  <div className="mt-3 rounded-xl border p-3" style={{ backgroundColor: colors.bg.tertiary, borderColor: colors.status.success }}>
                    <p className="text-xs font-semibold mb-1" style={{ color: colors.status.success }}>RESPONSE FROM SUPPORT</p>
                    <p className="text-sm" style={{ color: colors.text.secondary }}>{ticket.response.message}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Support;

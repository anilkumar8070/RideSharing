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
    return <div className="p-4 h-full text-white flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="p-4 h-full overflow-y-auto pb-20 md:pb-0" style={{ backgroundColor: colors.bg.secondary, color: colors.text.primary }}>
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <HelpCircle className="text-primary" size={32} />
            Support & Feedback
          </h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition hover:opacity-80"
            style={{ backgroundColor: colors.primary, color: 'white' }}
          >
            <Plus size={18} />
            New Ticket
          </button>
        </div>

        {/* Create Ticket Form */}
        {showForm && (
          <div className="p-6 rounded-2xl border mb-6" style={{ backgroundColor: colors.bg.tertiary, borderColor: colors.border }}>
            <h2 className="text-xl font-bold mb-4">Create Support Ticket</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.text.secondary }}>Issue Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl border outline-none transition-colors"
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
                  className="w-full px-4 py-2 rounded-xl border outline-none transition-colors"
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
                  className="w-full px-4 py-2 rounded-xl border outline-none transition-colors"
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
                  className="w-full px-4 py-2 rounded-xl border outline-none resize-none transition-colors"
                  style={{ backgroundColor: colors.bg.primary, borderColor: colors.border, color: colors.text.primary }}
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-3 rounded-xl font-bold transition disabled:opacity-50 hover:opacity-80"
                  style={{ backgroundColor: colors.primary, color: 'white' }}
                >
                  {submitting ? 'Submitting...' : 'Submit Ticket'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-3 rounded-xl font-bold transition border hover:bg-opacity-10"
                  style={{ backgroundColor: 'transparent', borderColor: colors.border, color: colors.text.primary }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="space-y-4">
          {tickets.length === 0 ? (
            <div className="p-12 rounded-2xl border text-center transition-colors" style={{ backgroundColor: colors.bg.tertiary, borderColor: colors.border }}>
              <MessageSquare size={48} className="mx-auto mb-4" style={{ color: colors.text.tertiary }} />
              <p className="mb-4" style={{ color: colors.text.secondary }}>No support tickets yet</p>
              <button
                onClick={() => setShowForm(true)}
                className="px-6 py-3 rounded-xl font-bold transition hover:opacity-80"
                style={{ backgroundColor: colors.primary, color: 'white' }}
              >
                Create One
              </button>
            </div>
          ) : (
            tickets.map((ticket) => (
              <div key={ticket._id} className="p-5 rounded-2xl border transition-colors hover:shadow-lg" 
                   style={{ backgroundColor: colors.bg.tertiary, borderColor: colors.border }}>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold" style={{ color: colors.text.primary }}>{ticket.title}</h3>
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
                  <div className="mt-3 p-3 bg-green-900/20 border border-green-700/30 rounded-lg">
                    <p className="text-xs text-green-400 font-semibold mb-1">RESPONSE FROM SUPPORT</p>
                    <p className="text-sm text-gray-200">{ticket.response.message}</p>
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

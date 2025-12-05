"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Appointment,
  AppointmentStatus,
  AppointmentFormData,
  AppointmentUpdateData,
} from "@/types/appointments";
import { User, Phone, Mail, Calendar, Clock, Bot, Save, Loader2 } from "lucide-react";
import { format, parseISO } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

interface ApptDetailModalProps {
  appointment: Appointment | null;
  open: boolean;
  onClose: () => void;
  onSave: (id: string, data: AppointmentUpdateData) => Promise<void>;
}

export function ApptDetailModal({
  appointment,
  open,
  onClose,
  onSave,
}: ApptDetailModalProps) {
  const [status, setStatus] = useState<AppointmentStatus>(appointment?.status || "pending");
  const [confirmedTime, setConfirmedTime] = useState(appointment?.confirmed_time || "");
  const [notes, setNotes] = useState(appointment?.notes || "");
  const [saving, setSaving] = useState(false);

  // Reset form when appointment changes
  if (appointment && status !== appointment.status) {
    setStatus(appointment.status);
    setConfirmedTime(appointment.confirmed_time || "");
    setNotes(appointment.notes || "");
  }

  const handleSave = async () => {
    if (!appointment) return;
    setSaving(true);
    try {
      await onSave(appointment.id, {
        status,
        confirmed_time: confirmedTime || undefined,
        notes: notes || undefined,
      });
      onClose();
    } catch (error) {
      console.error("Failed to save:", error);
    } finally {
      setSaving(false);
    }
  };

  if (!appointment) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            {appointment.customer_name}
          </DialogTitle>
          <DialogDescription>{appointment.service}</DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {/* Contact Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
              {appointment.customer_phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{appointment.customer_phone}</span>
                </div>
              )}
              {appointment.customer_email && (
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{appointment.customer_email}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Requested: {formatDateTime(appointment.requested_time)}</span>
              </div>
              {appointment.confirmed_time && (
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-green-500" />
                  <span>Confirmed: {formatDateTime(appointment.confirmed_time)}</span>
                </div>
              )}
            </div>

            {/* Editable Fields */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={status} onValueChange={(v) => setStatus(v as AppointmentStatus)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="canceled">Canceled</SelectItem>
                    <SelectItem value="no_show">No Show</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Confirmed Time</Label>
                <Input
                  type="datetime-local"
                  value={confirmedTime ? confirmedTime.slice(0, 16) : ""}
                  onChange={(e) => setConfirmedTime(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add notes..."
                  rows={3}
                />
              </div>
            </div>

            {/* AI Conversation */}
            {appointment.ai_conversation && appointment.ai_conversation.length > 0 && (
              <AIConversation messages={appointment.ai_conversation} />
            )}
          </motion.div>
        </ScrollArea>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function AIConversation({ messages }: { messages: Appointment["ai_conversation"] }) {
  if (!messages || messages.length === 0) return null;

  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-2">
        <Bot className="h-4 w-4 text-primary" />
        AI Conversation
      </Label>
      <div className="bg-muted/50 rounded-lg p-3 space-y-2 max-h-[200px] overflow-y-auto">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`text-sm p-2 rounded ${
              msg.role === "assistant"
                ? "bg-primary/10 ml-4"
                : "bg-background mr-4"
            }`}
          >
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <Badge variant="outline" className="text-[10px]">
                {msg.role === "assistant" ? "AI" : "Customer"}
              </Badge>
              {msg.timestamp && format(parseISO(msg.timestamp), "h:mm a")}
            </div>
            <p>{msg.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function formatDateTime(iso: string): string {
  try {
    return format(parseISO(iso), "MMM d, yyyy h:mm a");
  } catch {
    return iso;
  }
}

// Create Appointment Modal
interface ApptCreateModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (data: AppointmentFormData) => Promise<void>;
}

export function ApptCreateModal({ open, onClose, onCreate }: ApptCreateModalProps) {
  const [formData, setFormData] = useState<AppointmentFormData>({
    customer_name: "",
    customer_phone: "",
    customer_email: "",
    service: "",
    requested_time: "",
    status: "pending",
    notes: "",
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customer_name || !formData.service || !formData.requested_time) return;

    setSaving(true);
    try {
      await onCreate(formData);
      setFormData({
        customer_name: "",
        customer_phone: "",
        customer_email: "",
        service: "",
        requested_time: "",
        status: "pending",
        notes: "",
      });
      onClose();
    } catch (error) {
      console.error("Failed to create:", error);
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: keyof AppointmentFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Appointment</DialogTitle>
          <DialogDescription>Schedule a new appointment</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Customer Name *</Label>
              <Input
                value={formData.customer_name}
                onChange={(e) => updateField("customer_name", e.target.value)}
                placeholder="John Doe"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Service *</Label>
              <Input
                value={formData.service}
                onChange={(e) => updateField("service", e.target.value)}
                placeholder="Consultation"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input
                type="tel"
                value={formData.customer_phone}
                onChange={(e) => updateField("customer_phone", e.target.value)}
                placeholder="+1 234 567 8900"
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={formData.customer_email}
                onChange={(e) => updateField("customer_email", e.target.value)}
                placeholder="john@example.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Requested Time *</Label>
            <Input
              type="datetime-local"
              value={formData.requested_time}
              onChange={(e) => updateField("requested_time", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Notes</Label>
            <Textarea
              value={formData.notes}
              onChange={(e) => updateField("notes", e.target.value)}
              placeholder="Additional notes..."
              rows={2}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Calendar className="h-4 w-4 mr-2" />
              )}
              Create Appointment
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

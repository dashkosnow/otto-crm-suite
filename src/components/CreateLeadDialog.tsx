import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Lead } from "@/data/leads";

const leadSchema = z.object({
  name: z.string().trim().min(2, "Мінімум 2 символи").max(100),
  company: z.string().trim().max(100).optional(),
  phone: z.string().trim().min(10, "Введіть коректний номер").max(20),
  email: z.string().trim().email("Некоректний email").max(255).or(z.literal("")).optional(),
  source: z.string().min(1, "Оберіть джерело"),
  amount: z.number().min(0).max(100_000_000).optional(),
  manager: z.string().min(1, "Оберіть менеджера"),
  note: z.string().trim().max(500).optional(),
});

const sources = ["Google Ads", "Instagram", "Рекомендація", "Виставка", "Сайт", "Холодний дзвінок"];
const managers = ["Олена К.", "Максим І."];

interface CreateLeadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (lead: Lead) => void;
}

const CreateLeadDialog = ({ open, onOpenChange, onCreated }: CreateLeadDialogProps) => {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [source, setSource] = useState("");
  const [amount, setAmount] = useState("");
  const [manager, setManager] = useState("");
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const resetForm = () => {
    setName(""); setCompany(""); setPhone(""); setEmail("");
    setSource(""); setAmount(""); setManager(""); setNote("");
    setErrors({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const parsed = leadSchema.safeParse({
      name,
      company: company || undefined,
      phone,
      email: email || undefined,
      source,
      amount: amount ? Number(amount) : undefined,
      manager,
      note: note || undefined,
    });

    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[String(err.path[0])] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    const today = new Date().toLocaleDateString("uk-UA", { day: "2-digit", month: "2-digit", year: "numeric" }).replace(/\//g, ".");

    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      name: parsed.data.name,
      company: parsed.data.company,
      phone: parsed.data.phone,
      email: parsed.data.email === "" ? undefined : parsed.data.email,
      source: parsed.data.source,
      stage: "new",
      manager: parsed.data.manager,
      amount: parsed.data.amount,
      note: parsed.data.note,
      createdAt: today,
      updatedAt: today,
    };

    onCreated(newLead);
    resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Новий лід</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="lead-name">Ім'я *</Label>
              <Input id="lead-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Прізвище Ім'я" />
              {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lead-company">Компанія</Label>
              <Input id="lead-company" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="ТОВ / ФОП" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="lead-phone">Телефон *</Label>
              <Input id="lead-phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+380 XX XXX XXXX" />
              {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lead-email">Email</Label>
              <Input id="lead-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" />
              {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label>Джерело *</Label>
              <Select value={source} onValueChange={setSource}>
                <SelectTrigger><SelectValue placeholder="Оберіть" /></SelectTrigger>
                <SelectContent>
                  {sources.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
              {errors.source && <p className="text-xs text-destructive">{errors.source}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lead-amount">Сума, ₴</Label>
              <Input id="lead-amount" type="number" min={0} value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0" />
            </div>
            <div className="space-y-1.5">
              <Label>Менеджер *</Label>
              <Select value={manager} onValueChange={setManager}>
                <SelectTrigger><SelectValue placeholder="Оберіть" /></SelectTrigger>
                <SelectContent>
                  {managers.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                </SelectContent>
              </Select>
              {errors.manager && <p className="text-xs text-destructive">{errors.manager}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="lead-note">Нотатка</Label>
            <Textarea id="lead-note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Деталі запиту..." rows={2} maxLength={500} />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Скасувати</Button>
            <Button type="submit">Створити лід</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateLeadDialog;

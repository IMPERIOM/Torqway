"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { toast } from "sonner";
import { submitContactLead } from "@/lib/actions/leads";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function ContactForm() {
  const [pending, startTransition] = useTransition();
  const [done, setDone] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const input = Object.fromEntries(
      new FormData(form),
    ) as Record<string, string>;

    startTransition(async () => {
      const res = await submitContactLead(input);
      if (res.ok) {
        setDone(true);
        toast.success("Thanks! We'll be in touch shortly.");
        form.reset();
      } else {
        toast.error(res.error ?? "Failed to send your message.");
      }
    });
  }

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-brand-200 bg-brand-50 p-10 text-center">
        <CheckCircle2 className="h-12 w-12 text-brand-600" />
        <h3 className="mt-4 font-heading text-xl font-semibold">
          Message sent
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Our team will get back to you as soon as possible.
        </p>
        <Button
          variant="outline"
          className="mt-5"
          onClick={() => setDone(false)}
        >
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="name">Full name *</Label>
          <Input id="name" name="name" required placeholder="Jane Doe" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            placeholder="jane@company.com"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" placeholder="+1 555 123 4567" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="country">Country</Label>
          <Input id="country" name="country" placeholder="United States" />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="company">Company</Label>
        <Input id="company" name="company" placeholder="Acme Logistics" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="message">Message *</Label>
        <Textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder="Tell us what you're looking for…"
        />
      </div>
      <Button type="submit" size="lg" disabled={pending}>
        <Send className="h-4 w-4" />
        {pending ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}

"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const CreateCampaign = ({ campaign }) => {

  const { register, handleSubmit, control } = useForm({
    defaultValues: {
        messaging_product:'whatsapp',
        to:recipient.phone,
        type:'template',
        template:template,
    }
  });

  // Manage recipients dynamically
  const { fields } = useFieldArray({
    control,
    name: "recipients"
  });

  const onSubmit = (data) => {
    console.log("Updated Campaign:", data);
    // You can dispatch Redux or call API here
    setOpen(false);
  };

  return (
    <section>
            <h2>Create a campaign</h2>
            <p>Use this template to start a campaign </p>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-5">
            {/* Campaign Fields */}
            <div>
              <Label>Campaign Name</Label>
              <Input {...register("name")} />
            </div>
            <div>
              <Label>Template</Label>
              <Input {...register("template")} />
            </div>
            <div>
              <Label>Status</Label>
              <Input {...register("status")} />
            </div>
            <div>
              <Label>Scheduled At</Label>
              <Input type="datetime-local" {...register("scheduled_at")} />
            </div>

            {/* Recipients */}
            <div>
              <Label>Recipients</Label>
              <div className="border rounded-lg p-2 max-h-60 overflow-y-auto space-y-3">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="grid grid-cols-3 gap-2 items-center border-b pb-2"
                  >
                    <Input
                      placeholder="Name"
                      {...register(`recipients.${index}.name`)}
                    />
                    <Input
                      placeholder="Phone"
                      {...register(`recipients.${index}.phone`)}
                    />
                    <Input
                      placeholder="Order ID"
                      {...register(`recipients.${index}.order_id`)}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save & Start Campaign</Button>
            </div>

          </form>
    </section>
  );
};

export default CreateCampaign;

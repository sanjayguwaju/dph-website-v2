import type { CollectionConfig } from "payload";

export const Appointments: CollectionConfig = {
  slug: "appointments",
  admin: {
    useAsTitle: "patientName",
    defaultColumns: ["patientName", "department", "appointmentDate", "status", "createdAt"],
  },
  access: {
    read: ({ req: { user } }) => Boolean(user),
    create: () => true, // Allow public submissions
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: "patientName",
      type: "text",
      required: true,
      label: "Patient Name",
    },
    {
      name: "phone",
      type: "text",
      required: true,
      label: "Phone Number",
    },
    {
      name: "email",
      type: "email",
      label: "Email (Optional)",
    },
    {
      name: "department",
      type: "relationship",
      relationTo: "services",
      required: true,
      label: "Department/Service",
    },
    {
      name: "appointmentDate",
      type: "date",
      required: true,
      label: "Preferred Date",
    },
    {
      name: "message",
      type: "textarea",
      label: "Additional Message",
    },
    {
      name: "status",
      type: "select",
      defaultValue: "pending",
      options: [
        { label: "Pending", value: "pending" },
        { label: "Confirmed", value: "confirmed" },
        { label: "Completed", value: "completed" },
        { label: "Cancelled", value: "cancelled" },
      ],
      admin: {
        position: "sidebar",
      },
    },
  ],
  timestamps: true,
};

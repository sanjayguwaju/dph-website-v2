import type { GlobalConfig } from "payload";

export const OpdStats: GlobalConfig = {
  slug: "opd-stats",
  label: "OPD Statistics",
  admin: {
    group: "Settings",
    description: "Daily OPD statistics shown in the homepage banner. Update daily.",
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: "lastUpdatedDate",
      type: "date",
      label: "Last Updated Date",
      defaultValue: () => new Date(),
    },
    {
      type: "collapsible",
      label: "OPD (Outpatient Department)",
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "opdMale",
              type: "number",
              label: "OPD Male",
              defaultValue: 0,
              admin: { width: "33%" },
            },
            {
              name: "opdFemale",
              type: "number",
              label: "OPD Female",
              defaultValue: 0,
              admin: { width: "33%" },
            },
            {
              name: "opdTotal",
              type: "number",
              label: "OPD Total",
              defaultValue: 0,
              admin: { width: "33%" },
            },
          ],
        },
      ],
    },
    {
      type: "collapsible",
      label: "Inpatient",
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "inpatientMale",
              type: "number",
              label: "Inpatient Male",
              defaultValue: 0,
              admin: { width: "33%" },
            },
            {
              name: "inpatientFemale",
              type: "number",
              label: "Inpatient Female",
              defaultValue: 0,
              admin: { width: "33%" },
            },
            {
              name: "inpatientTotal",
              type: "number",
              label: "Inpatient Total",
              defaultValue: 0,
              admin: { width: "33%" },
            },
          ],
        },
      ],
    },
    {
      type: "collapsible",
      label: "Bed Information",
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "totalBeds",
              type: "number",
              label: "Total Beds",
              defaultValue: 0,
              admin: { width: "50%" },
            },
            {
              name: "bedOccupancy",
              type: "number",
              label: "Bed Occupancy",
              defaultValue: 0,
              admin: { width: "50%" },
            },
          ],
        },
      ],
    },
  ],
};

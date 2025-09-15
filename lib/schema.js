import { z } from "zod";

/* ---------------- INT ---------------- */
export const preprocessInt = (msg, invalidMsg = msg) =>
  z.preprocess(
    (val) => {
      const parsed = parseInt(val, 10);
      return isNaN(parsed) ? undefined : parsed;
    },
    z.number({ required_error: msg, invalid_type_error: invalidMsg }).int({ message: invalidMsg })
  );

export const preprocessIntOptional = (msg = "Invalid integer") =>
  z.preprocess(
    (val) => {
      const parsed = parseInt(val, 10);
      return isNaN(parsed) ? undefined : parsed;
    },
    z.number().int({ message: msg }).optional()
  );

/* ---------------- FLOAT / DOUBLE ---------------- */
export const preprocessDouble = (msg, invalidMsg = msg) =>
  z.preprocess(
    (val) => {
      const parsed = parseFloat(val);
      return isNaN(parsed) ? undefined : parsed;
    },
    z
      .number({ required_error: msg, invalid_type_error: invalidMsg })
      .refine((v) => !isNaN(v), { message: invalidMsg })
  );

export const preprocessDoubleOptional = (msg = "Invalid number") =>
  z.preprocess(
    (val) => {
      const parsed = parseFloat(val);
      return isNaN(parsed) ? undefined : parsed;
    },
    z.number().refine((v) => !isNaN(v), { message: msg }).optional()
  );

/* ---------------- STRING ---------------- */
export const preprocessString = (msg, minMsg = msg) =>
  z.preprocess(
    (val) => (typeof val === "string" ? val.trim() : val),
    z.string({ required_error: msg, invalid_type_error: minMsg }).min(1, { message: minMsg })
  );

export const preprocessStringOptional = (msg = "Invalid string") =>
  z.preprocess(
    (val) => (typeof val === "string" ? val.trim() : val),
    z.string().min(1, { message: msg }).optional()
  );

/* ---------------- BOOLEAN ---------------- */
export const preprocessBoolean = (msg = "Invalid boolean") =>
  z.preprocess((val) => {
    if (typeof val === "boolean") return val;
    if (typeof val === "string") {
      const lower = val.toLowerCase().trim();
      if (["true", "1", "yes"].includes(lower)) return true;
      if (["false", "0", "no"].includes(lower)) return false;
    }
    if (typeof val === "number") return val === 1;
    return undefined;
  }, z.boolean({ required_error: msg, invalid_type_error: msg }));

export const preprocessBooleanOptional = (msg = "Invalid boolean") =>
  z.preprocess((val) => {
    if (typeof val === "boolean") return val;
    if (typeof val === "string") {
      const lower = val.toLowerCase().trim();
      if (["true", "1", "yes"].includes(lower)) return true;
      if (["false", "0", "no"].includes(lower)) return false;
    }
    if (typeof val === "number") return val === 1;
    return undefined;
  }, z.boolean().optional());

/* ---------------- ENUM ---------------- */
export const preprocessEnum = (values, msg) =>
  z.enum(values, { required_error: msg, invalid_type_error: msg });

export const preprocessEnumOptional = (values, msg = "Invalid value") =>
  z.enum(values, { invalid_type_error: msg }).optional();

/* ---------------- DATE ---------------- */
export const preprocessDate = (msg = "Invalid date") =>
  z.preprocess((val) => {
    const date = new Date(val);
    return isNaN(date.getTime()) ? undefined : date;
  }, z.date({ required_error: msg }));

export const preprocessDateOptional = () =>
  z.preprocess((val) => {
    const date = new Date(val);
    return isNaN(date.getTime()) ? undefined : date;
  }, z.date().optional());

/* ---------------- ARRAY ---------------- */
export const preprocessArray = (schema, msg = "Invalid array") =>
  z.preprocess(
    (val) => {
      if (Array.isArray(val)) return val;
      if (typeof val === "string") {
        try {
          const parsed = JSON.parse(val);
          return Array.isArray(parsed) ? parsed : undefined;
        } catch {
          return undefined;
        }
      }
      return undefined;
    },
    z.array(schema, { required_error: msg, invalid_type_error: msg })
  );

export const preprocessArrayOptional = (schema, msg = "Invalid array") =>
  z.preprocess(
    (val) => {
      if (Array.isArray(val)) return val;
      if (typeof val === "string") {
        try {
          const parsed = JSON.parse(val);
          return Array.isArray(parsed) ? parsed : undefined;
        } catch {
          return undefined;
        }
      }
      return undefined;
    },
    z.array(schema).optional()
  );

/* ---------------- OBJECT ---------------- */
export const preprocessObject = (shape, msg = "Invalid object") =>
  z.preprocess(
    (val) => {
      if (typeof val === "object" && val !== null) return val;
      if (typeof val === "string") {
        try {
          const parsed = JSON.parse(val);
          return typeof parsed === "object" ? parsed : undefined;
        } catch {
          return undefined;
        }
      }
      return undefined;
    },
    z.object(shape, { required_error: msg, invalid_type_error: msg })
  );

export const preprocessObjectOptional = (shape, msg = "Invalid object") =>
  z.preprocess(
    (val) => {
      if (typeof val === "object" && val !== null) return val;
      if (typeof val === "string") {
        try {
          const parsed = JSON.parse(val);
          return typeof parsed === "object" ? parsed : undefined;
        } catch {
          return undefined;
        }
      }
      return undefined;
    },
    z.object(shape).optional()
  );

/* ---------------- ANY ---------------- */
export const preprocessAny = (shape) =>
  z
    .union([
      z.string().url("Must be a valid URL"),
      z.string(),
      z.object(shape || {}).passthrough(),
    ])
    .nullable()
    .optional();

/* ---------------- FILE ---------------- */
export const preprocessFileFlexible = (msg = "Invalid input") =>
  z
    .any()
    .optional()
    .refine(
      (val) => val === undefined || typeof val === "string" || (typeof File !== "undefined" && val instanceof File),
      { message: msg }
    );

/* ---------------- FORMAT DATA ---------------- */
export const formatData = (items, dateFields = [], datetimeFields = []) => {
  const formatDate = (val) => {
    if (!val) return null;
    const d = new Date(val);
    return isNaN(d.getTime())
      ? null
      : `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
          d.getDate()
        ).padStart(2, "0")}`;
  };

  const formatDateTime = (val) => {
    if (!val) return null;
    const d = new Date(val);
    return isNaN(d.getTime()) ? null : d.toISOString();
  };

  const getNested = (obj, path) =>
    path.split(".").reduce((acc, key) => (acc ? acc[key] : undefined), obj);

  const setNested = (obj, path, value) => {
    const keys = path.split(".");
    const lastKey = keys.pop();
    const target = keys.reduce((acc, key) => (acc[key] = acc[key] || {}), obj);
    target[lastKey] = value;
  };

  return items.map((item) => {
    const result = JSON.parse(JSON.stringify(item));
    dateFields.forEach((field) => {
      const val = getNested(result, field);
      if (val) setNested(result, field, formatDate(val));
    });
    datetimeFields.forEach((field) => {
      const val = getNested(result, field);
      if (val) setNested(result, field, formatDateTime(val));
    });
    return result;
  });
};

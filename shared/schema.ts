import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  isPremium: boolean("is_premium").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const processedFiles = pgTable("processed_files", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  fileName: text("file_name").notNull(),
  fileSize: integer("file_size").notNull(),
  operation: text("operation").notNull(),
  status: text("status").notNull(), // 'processing', 'completed', 'failed'
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
});

export const insertProcessedFileSchema = createInsertSchema(processedFiles).pick({
  fileName: true,
  fileSize: true,
  operation: true,
  status: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertProcessedFile = z.infer<typeof insertProcessedFileSchema>;
export type ProcessedFile = typeof processedFiles.$inferSelect;

// PDF Tool Types
export type PDFTool = {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'organize' | 'convert' | 'edit' | 'security';
  color: string;
  isNew?: boolean;
  isPremium?: boolean;
};

export type FileProcessingStatus = 'idle' | 'uploading' | 'processing' | 'completed' | 'error';

export type ProcessingResult = {
  success: boolean;
  data?: Uint8Array;
  error?: string;
  fileName?: string;
};

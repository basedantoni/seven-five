CREATE TABLE "challenge_day_tasks" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "challenge_day_tasks_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"challenge_day_id" bigint NOT NULL,
	"task_id" bigint NOT NULL,
	"completed" boolean DEFAULT false NOT NULL,
	"completed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "challenge_day_tasks_challenge_day_id_task_id_unique" UNIQUE("challenge_day_id","task_id")
);
--> statement-breakpoint
ALTER TABLE "challenge_day_tasks" ADD CONSTRAINT "challenge_day_tasks_challenge_day_id_challenge_days_id_fk" FOREIGN KEY ("challenge_day_id") REFERENCES "public"."challenge_days"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "challenge_day_tasks" ADD CONSTRAINT "challenge_day_tasks_task_id_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."tasks"("id") ON DELETE cascade ON UPDATE no action;
CREATE TABLE "challenge_days" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "challenge_days_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"challenge_id" bigint NOT NULL,
	"day" "smallserial" NOT NULL,
	"completed" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "task_logs" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "task_logs" CASCADE;--> statement-breakpoint
ALTER TABLE "challenge_days" ADD CONSTRAINT "challenge_days_challenge_id_challenges_id_fk" FOREIGN KEY ("challenge_id") REFERENCES "public"."challenges"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "challenges" DROP COLUMN "description";--> statement-breakpoint
ALTER TABLE "challenges" ADD CONSTRAINT "challenges_name_unique" UNIQUE("name");
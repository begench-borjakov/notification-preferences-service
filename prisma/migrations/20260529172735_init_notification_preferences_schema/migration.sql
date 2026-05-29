-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('marketing', 'transactional', 'security');

-- CreateEnum
CREATE TYPE "Channel" AS ENUM ('email', 'sms', 'push', 'messenger');

-- CreateEnum
CREATE TYPE "Region" AS ENUM ('GLOBAL', 'EU', 'US', 'TR');

-- CreateEnum
CREATE TYPE "PolicyAction" AS ENUM ('allow', 'deny');

-- CreateTable
CREATE TABLE "default_preferences" (
    "id" TEXT NOT NULL,
    "notification_type" "NotificationType" NOT NULL,
    "channel" "Channel" NOT NULL,
    "enabled" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "default_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_preferences" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "notification_type" "NotificationType" NOT NULL,
    "channel" "Channel" NOT NULL,
    "enabled" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_settings" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "optional_notifications_enabled" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quiet_hours" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL,
    "start_time" TEXT NOT NULL,
    "end_time" TEXT NOT NULL,
    "timezone" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "quiet_hours_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "global_policies" (
    "id" TEXT NOT NULL,
    "notification_type" "NotificationType" NOT NULL,
    "channel" "Channel" NOT NULL,
    "region" "Region" NOT NULL,
    "action" "PolicyAction" NOT NULL,
    "reason" TEXT,
    "enabled" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "global_policies_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "default_preferences_notification_type_channel_key" ON "default_preferences"("notification_type", "channel");

-- CreateIndex
CREATE UNIQUE INDEX "user_preferences_user_id_notification_type_channel_key" ON "user_preferences"("user_id", "notification_type", "channel");

-- CreateIndex
CREATE UNIQUE INDEX "user_settings_user_id_key" ON "user_settings"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "quiet_hours_user_id_key" ON "quiet_hours"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "global_policies_notification_type_channel_region_key" ON "global_policies"("notification_type", "channel", "region");

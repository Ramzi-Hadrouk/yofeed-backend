import { relations } from "drizzle-orm/relations";
import { events, eventAnalytics, users, tokens, userInterests, userFollows, organizerProfiles, eventOrganizers, eventCollaborators, registrations, eventBookmarks, notifications, userBadges, badges, eventMedia, eventFeedback } from "./schema";

export const eventAnalyticsRelations = relations(eventAnalytics, ({one}) => ({
	event: one(events, {
		fields: [eventAnalytics.eventId],
		references: [events.id]
	}),
}));

export const eventsRelations = relations(events, ({many}) => ({
	eventAnalytics: many(eventAnalytics),
	eventOrganizers: many(eventOrganizers),
	eventCollaborators: many(eventCollaborators),
	registrations: many(registrations),
	eventBookmarks: many(eventBookmarks),
	notifications: many(notifications),
	userBadges: many(userBadges),
	eventMedias: many(eventMedia),
	eventFeedbacks: many(eventFeedback),
}));

export const tokensRelations = relations(tokens, ({one}) => ({
	user: one(users, {
		fields: [tokens.userId],
		references: [users.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	tokens: many(tokens),
	userInterests: many(userInterests),
	userFollows_followerId: many(userFollows, {
		relationName: "userFollows_followerId_users_id"
	}),
	userFollows_followingId: many(userFollows, {
		relationName: "userFollows_followingId_users_id"
	}),
	organizerProfiles: many(organizerProfiles),
	eventCollaborators_userId: many(eventCollaborators, {
		relationName: "eventCollaborators_userId_users_id"
	}),
	eventCollaborators_invitedBy: many(eventCollaborators, {
		relationName: "eventCollaborators_invitedBy_users_id"
	}),
	registrations_userId: many(registrations, {
		relationName: "registrations_userId_users_id"
	}),
	registrations_checkedInBy: many(registrations, {
		relationName: "registrations_checkedInBy_users_id"
	}),
	eventBookmarks: many(eventBookmarks),
	notifications_userId: many(notifications, {
		relationName: "notifications_userId_users_id"
	}),
	notifications_relatedUserId: many(notifications, {
		relationName: "notifications_relatedUserId_users_id"
	}),
	userBadges: many(userBadges),
	eventMedias: many(eventMedia),
	eventFeedbacks: many(eventFeedback),
}));

export const userInterestsRelations = relations(userInterests, ({one}) => ({
	user: one(users, {
		fields: [userInterests.userId],
		references: [users.id]
	}),
}));

export const userFollowsRelations = relations(userFollows, ({one}) => ({
	user_followerId: one(users, {
		fields: [userFollows.followerId],
		references: [users.id],
		relationName: "userFollows_followerId_users_id"
	}),
	user_followingId: one(users, {
		fields: [userFollows.followingId],
		references: [users.id],
		relationName: "userFollows_followingId_users_id"
	}),
}));

export const organizerProfilesRelations = relations(organizerProfiles, ({one, many}) => ({
	user: one(users, {
		fields: [organizerProfiles.userId],
		references: [users.id]
	}),
	eventOrganizers: many(eventOrganizers),
}));

export const eventOrganizersRelations = relations(eventOrganizers, ({one}) => ({
	event: one(events, {
		fields: [eventOrganizers.eventId],
		references: [events.id]
	}),
	organizerProfile: one(organizerProfiles, {
		fields: [eventOrganizers.organizerId],
		references: [organizerProfiles.id]
	}),
}));

export const eventCollaboratorsRelations = relations(eventCollaborators, ({one}) => ({
	event: one(events, {
		fields: [eventCollaborators.eventId],
		references: [events.id]
	}),
	user_userId: one(users, {
		fields: [eventCollaborators.userId],
		references: [users.id],
		relationName: "eventCollaborators_userId_users_id"
	}),
	user_invitedBy: one(users, {
		fields: [eventCollaborators.invitedBy],
		references: [users.id],
		relationName: "eventCollaborators_invitedBy_users_id"
	}),
}));

export const registrationsRelations = relations(registrations, ({one}) => ({
	event: one(events, {
		fields: [registrations.eventId],
		references: [events.id]
	}),
	user_userId: one(users, {
		fields: [registrations.userId],
		references: [users.id],
		relationName: "registrations_userId_users_id"
	}),
	user_checkedInBy: one(users, {
		fields: [registrations.checkedInBy],
		references: [users.id],
		relationName: "registrations_checkedInBy_users_id"
	}),
}));

export const eventBookmarksRelations = relations(eventBookmarks, ({one}) => ({
	event: one(events, {
		fields: [eventBookmarks.eventId],
		references: [events.id]
	}),
	user: one(users, {
		fields: [eventBookmarks.userId],
		references: [users.id]
	}),
}));

export const notificationsRelations = relations(notifications, ({one}) => ({
	user_userId: one(users, {
		fields: [notifications.userId],
		references: [users.id],
		relationName: "notifications_userId_users_id"
	}),
	event: one(events, {
		fields: [notifications.eventId],
		references: [events.id]
	}),
	user_relatedUserId: one(users, {
		fields: [notifications.relatedUserId],
		references: [users.id],
		relationName: "notifications_relatedUserId_users_id"
	}),
}));

export const userBadgesRelations = relations(userBadges, ({one}) => ({
	user: one(users, {
		fields: [userBadges.userId],
		references: [users.id]
	}),
	badge: one(badges, {
		fields: [userBadges.badgeId],
		references: [badges.id]
	}),
	event: one(events, {
		fields: [userBadges.eventId],
		references: [events.id]
	}),
}));

export const badgesRelations = relations(badges, ({many}) => ({
	userBadges: many(userBadges),
}));

export const eventMediaRelations = relations(eventMedia, ({one}) => ({
	event: one(events, {
		fields: [eventMedia.eventId],
		references: [events.id]
	}),
	user: one(users, {
		fields: [eventMedia.uploadedBy],
		references: [users.id]
	}),
}));

export const eventFeedbackRelations = relations(eventFeedback, ({one}) => ({
	event: one(events, {
		fields: [eventFeedback.eventId],
		references: [events.id]
	}),
	user: one(users, {
		fields: [eventFeedback.userId],
		references: [users.id]
	}),
}));
import orm from "orm";
import {LocalDateTime} from "@js-joda/core";

export let Database = undefined;

orm.connect("sqlite://var/data", (err, orm) => {
	if (err) throw err;
	
	// Represents a Storage System
	// The computer (or turtle) has to authenticate with the server
	const Storage = orm.define("storage", {})
	
	const User = orm.define("user", {
		email: String,
	})
	
	const AccessToken = orm.define("tokens", {
		accessToken: String,
		accessTokenExpire: LocalDateTime
	})
	
	const StorageAccess = orm.define("access", {
		config: Boolean,
		read: Boolean,
		write: Boolean,
	})
	
	Storage.hasOne("owner", User)
	StorageAccess.hasOne("storage", Storage)
	User.hasMany("access", StorageAccess)
	
	orm.sync((err) => {
		if (err) throw err;
		
		Database = orm;
	});
	
});

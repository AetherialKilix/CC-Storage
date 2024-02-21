import orm from "orm";

let db = undefined;

orm.connect("sqlite://var/log", (err, orm) => {
	if (err) throw err;
	
	const Storage = orm.define("AccessLog", {
		storage: String,
		player: String,
		timestamp: Date,
		type: ["access", "deny", "error"]
	})
	
	orm.sync((err) => {
		if (err) throw err;
		db = orm;
	});
	
});
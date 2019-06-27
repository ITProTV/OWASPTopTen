
exports.up = knex =>  {
  return knex.schema
	.createTable('users', t => {
   	   t.increments('id')
	   t.string('first_name', 255).notNullable()
	   t.string('last_name', 255).notNullable()
	   t.string('email', 255).notNullable().unique()
	   t.string('hash').notNullable()
	   t.string('salt').notNullable()
	})
	.createTable('roles', t => {
   	   t.increments('id')
	   t.enum('type', ['admin', 'user']).notNullable()
	   t.integer('user_id')
		.references('id')
		.inTable('users')
		.notNullable()
		.unique()
	})
}

exports.down = knex => knex.schema.dropTable('users').dropTable('roles')
  

# Models

## Strategic

 - Models should be *skinny*
 - Logic for dealing with models should be grouped placed into services (see /services)

## Tactical

 - Currently use Mongoose for ODB
 - Most standard models should use Mongoose for now
 - More specialized things (like revisions) may use separate types of backends (e.g. git, AWS, GridFS, etc.)
 - All files in models using Mongoose should export one item with the same name as the model (e.g. in project.js we `exports = new mongoose.Model("Project", schema);`)

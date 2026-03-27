
'use strict';
import mongoose from 'mongoose';

const catSchema = mongoose.Schema({ name: String });
const Cat = mongoose.model('Cat', catSchema);


module.exports = Cat;
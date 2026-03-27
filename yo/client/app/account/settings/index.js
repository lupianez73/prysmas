'use strict';

import angular from 'angular';
import SettingsController from './settings.controller';

export default angular.module('desktopApp.settings', [])
  .controller('SettingsController', SettingsController)
  .name;

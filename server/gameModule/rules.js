var extend = require('extend');
var helper = require('./helper.js');
var EnumBarrier = require('./../GeneralClass/const.js').EnumBarrier;



module.exports = {
	init: function(settings) {
		extend(this, settings);
	},
	rulesMovementBullet: function(aBullet, newPos, idThis) {
		var conflict = false;

		for (var i = 0; i < this.tanks.length; i++) {
			var tank = this.tanks[i];
			if (tank) {
				if (idThis === tank.id) {
					continue;
				}
				for (var b = 0; b < tank.bullets.length; b++) {

					var bullet = tank.bullets[b];
					if (helper.macroCollision(bullet, aBullet, newPos)) {
						conflict = true;
						return bullet;
						break;
					}
				}
			}
		}


		if (!conflict) {
			aBullet.position = newPos;
		}
	},
	rulesBarriers: function(obj, newPos, exceptions) {
		//barriers


		var arrRes = [];
		for (var i = 0; i < this.battleArea.barriers.length; i++) {
			var bar = this.battleArea.barriers[i];


			if (exceptions && exceptions(bar)) {
				continue;
			}

			if (helper.macroCollision(bar, obj, newPos)) {

				//bar.hit(aBullet);
				arrRes.push(bar);
				//break;
			}
		}
		return arrRes;
	},
	rulesMovementTank: function(aTank, newPos, idThis) {
		var conflict = false;

		for (var i = 0; i < this.tanks.length; i++) {
			var tank = this.tanks[i];
			if (tank) {


				if (idThis === tank.id) {
					continue;
				}
				if (helper.macroCollision(tank, aTank, newPos)) {
					conflict = true;
					return tank;
					break;
				}
			}
		}


		return conflict;


	},
	rulesMovement: function(aTank, newPos) {
		this.battleAreaRule(aTank, newPos);

		function exceptions(bar) {
			return bar.type === EnumBarrier.forest;
		}
		var arrConflicts = this.rulesBarriers(aTank, newPos, exceptions);
		if (arrConflicts.length === 0) {
			if (this.rulesMovementTank(aTank, newPos, aTank.id) === false) {
				aTank.position = newPos;
				return false;
			}
		}

		/// танки

		return true;

	},
	battleAreaRule: function(aTank, newPos) {
		var conflict = false;
		if (newPos.x < 0) {
			conflict = true;
			newPos.x = 0;
		}
		if (newPos.y < 0) {
			newPos.y = 0;
			conflict = true;
		}
		var xFar = newPos.x + aTank.width;
		if (xFar > this.battleArea.w) {
			newPos.x = this.battleArea.w - aTank.width;
			conflict = true;
		}
		var yFar = newPos.y + aTank.height;
		if (yFar > this.battleArea.h) {
			newPos.y = this.battleArea.h - aTank.height;
			conflict = true;
		}
		return conflict;

	}
};
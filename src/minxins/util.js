export default {
	methods: {
		//获取字典
		async getStandardCode(codeName) {
			let res = await new Promise((resolve, reject) => {
				this.MK.Request("dic_standardcode_Get", "GET", {
						codetype: codeName
					})
					.then(res => {
						if (res.code == 0) {
							resolve(res)
						} else {
							reject(res)
						}
					})
					.catch(error => {
						reject(error)
					})
			})
			return res;
		},
		//获取字典字段进行过滤
		async GetCodefilter(codeName) {
			let filterArrStatus = [];
			let resData = await this.getStandardCode(codeName);
			if (resData.code == 0) {
				let Arr = resData.data;
				Arr.forEach(item => {
					filterArrStatus.push({
						text: item.BZNAME,
						value: item.BZNAME
					})
				})
			}
			return filterArrStatus
		},
		// 按钮权限
		async PostButtonLimit(obj) {
			let res = await new Promise((resolve, reject) => {
				this.MK.Request(
						"ButtonAccess_Add",
						"post", {
							ButtonAccessArr: obj
						}
					)
					.then(res => {
						if (res.code == 0) {
							resolve(res)
						} else {
							reject(res)
						}
					})
					.catch(error => {
						reject(error)
					})
			})
			return res;
		},
		//密码重置
		async ResetPassword(LOGINUID) {
			if (LOGINUID == "") {
				this.$message({
					type: "warning",
					message: "请选择账户重置密码"
				});
				return;
			}
			let res = await new Promise((resolve, reject) => {
				this.MK.Request(
						"ResetPassword",
						"post", {
							LOGINUID: LOGINUID
						}, {
							app: "11d9ade0fdac465595bc78eff18a25f2",
							mod: "grxx"
						}
					)
					.then(res => {
						if (res.code == 0) {
							this.$message({
								type: "success",
								message: res.msg
							});
							resolve(res)
						} else {
							reject(res)
						}
					})
					.catch(error => {
						reject(error)
					})
			})
			return res;
		},
		// 表格金额过滤,
		projectAmountsTabel(row, money) {
			let num = row[money]; // 过滤字段
			if (isNaN(parseFloat(num))) {
				return 0.0;
			} else if (num === 0) {
				return 0.0;
			} else {
				return num ?
					(isNaN(parseFloat(num.toString().replace(/,/g, ""))) ?
						1 :
						parseFloat(num.toString().replace(/,/g, ""))
					)
					.toFixed(2)
					.toString()
					.replace(/(\d)(?=(\d{3})+\.)/g, function($0, $1) {
						return $1 + ",";
					}) :
					"";
			}
		},
		//排序
		sortColumn(column, url, param, handler) {
			// ORDERKEY:'排序字段' ORDER: DESC 降序  ASC升序
			console.log(column)
			if (column.sortable == "custom") {
				if (column.order == 'descending') {
					param.orderby = `${column.property} desc`
				} else if (column.order == 'ascending') {
					param.orderby = `${column.property} asc`
				} else {
					param.orderby = '';
				}
				this.MK.Request(
					url,
					"get",
					param
				).then(res => {
					handler(res);
				});
			} else if (column.sortable == "none") {
				this.MK.Request(
					url,
					"get",
					param
				).then(res => {
					handler(res);
				});
			} else {

			}
		},
		//上移
		MoveUp(index, row, list, id, orderno, handler, url) {
			if (index == 0) {
				this.$message({
					type: "error",
					message: "当前为第一行,不能上移!"
				});
				return;
			}
			var PreRow = list[index - 1];
			this.MoveUpAndDown(row, PreRow, id, orderno, handler, url);
		},
		//下移
		MoveDow(index, row, list, id, orderno, handler, url) {
			if (index + 1 == list.length) {
				this.$message({
					type: "error",
					message: "当前为最后一行,不能下移!"
				});
				return;
			}
			var NextRow = list[index + 1];
			this.MoveUpAndDown(row, NextRow, id, orderno, handler, url);
		},
		//
		MoveUpAndDown(Currentrow, NextRow, id, orderno, handler, url) {
			let opt = {}
			opt['current' + id] = Currentrow[id]
			opt['current' + orderno] = Currentrow[orderno];
			opt['next' + id] = NextRow[id];
			opt['next' + orderno] = NextRow[orderno];
			console.log(opt)
			this.MK.Request(url, "post", { ...opt,
				...Currentrow
			}).then(res => {
				if (res.code == 0) {
					this.$message({
						type: "success",
						message: res.msg
					});
					handler()
				}
			});
		},
		Copy(row, url, Tooltip, key, handler) {
			let cloneRow = JSON.parse(JSON.stringify(row))
			cloneRow.createid = this.info.userid;
			this.$prompt(`请输入${Tooltip}`, '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				inputPattern: /\S/,
				inputErrorMessage: `${Tooltip}不能为空`
			}).then(({
				value
			}) => {
				cloneRow[key] = value;
				this.MK.Request(url, "post", cloneRow).then(res => {
					if (res.code == 0) {
						this.$message({
							type: "success",
							message: res.msg
						});
						handler();
					}
				});
			}).catch(() => {

			});
		},
		/**
		 * @description 当前table 行状态操作 例如停启用
		 * @param {Object} row 当前行数据
		 * @param {String} url 请求Api地址
		 * @param {String} OFF 询问 提示关键字
		 * @param {String} NO 询问 提示关键字
		 * @param {Function} handler 操作完成 请求列表接口刷新页面
		 * @param {String} type 操作类型 C:新增 U:修改 D:删除 默认为C新增
		 */
		Examine(row, url, OFF, NO, handler, operatetyp = 'C') {
			let str = NO;
			let cloneRow = JSON.parse(JSON.stringify(row));
			str = cloneRow.status != 1 ? NO : OFF;
			cloneRow.status = operatetyp == 'D' ? 99 : row.status != 1 ? 1 : 0;
			cloneRow.operatetype = operatetyp;
			this.$confirm(`确认要${str}, 是否继续?`, "提示", {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning"
				})
				.then(() => {
					this.MK.Request(url, "post", cloneRow).then(res => {
						if (res.code == 0) {
							this.$message({
								type: "success",
								message: res.msg
							});
							handler();
						}
					});
				})
				.catch(() => {});
		},
		//
		PhoneFormat(row, name) {
			let num = row[name];
			if (!num) return ''
			return num.substr(0, 3) + '****' + num.substr(7);

		},
		DateFormat(row, name) {
			var date = row[name]
			const year = new Date(date).getFullYear();
			const month = new Date(date).getMonth() + 1 < 10 ? '0' + (new Date(date).getMonth() + 1) : new Date(date).getMonth() +
				1;
			const day = new Date(date).getDate() < 10 ? '0' + new Date(date).getDate() : new Date(date).getDate();
			return `${year}-${month}-${day}`;
		},
		// 日期格式化 传入值如 20200503
		dateFormatSpec(row, name) {
			if (row[name]) {
				var date = row[name].toString()
				var year = date.substr(0, 4);
				var month = date.substr(4, 2);
				var day = date.substr(6);
				return `${year}-${month}-${day}`;
			} else {
				return ''
			}
		}
	}
}

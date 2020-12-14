<template>
	<vxe-modal v-model="memberRegisterModal" width="1320" height="900">
		<div slot="title">
			{{ isNewMember ? '注册会员' : '编辑会员信息' }}
			<span v-if="!isNewMember">
				- [
				<span style="color:red;">
					会员等级：{{ curRowData.memberlevel_display }} 卡号：{{ curRowData.cardno }} {{ registerTyle }}姓名：{{ curRowData.membername }} 性别：{{
						curRowData.sex_dispalay
					}}
					年龄：{{ curRowData.age }}
				</span>
				]
			</span>
		</div>
		<el-steps :active="activeStep" align-center finish-status="success">
			<el-step :title="registerTyle + '基本信息'" @click.native="handleChangeStep(0)" icon="el-icon-document"></el-step>
			<el-step title="附加信息" @click.native="handleChangeStep(1)" icon="el-icon-folder-add"></el-step>
			<el-step title="资料上传" @click.native="handleChangeStep(2)" icon="el-icon-upload"></el-step>
			<!-- <el-step title="家庭成员" @click.native="handleChangeStep(3)" icon="el-icon-user-solid"></el-step> -->
			<el-step title="紧急联系人" @click.native="handleChangeStep(4)" icon="el-icon-user-solid"></el-step>
		</el-steps>
		<!-- 会员基本信息 -->
		<template v-if="activeStep == 0">
			<div class="base-info-form">
				<el-form :model="baseInfoForm" :rules="baseInfoRules" :inline="true" ref="baseInfoForm" label-width="100px" class="demo-ruleForm">
					<!-- 基本信息表单第一部分 -->
					<div style="width:84%;position:absolute; left:10px">
						<el-form-item :label="cardLabel" prop="cardno">
							<el-input v-if="registerTyle == '会员'" :disabled="memberRead" class="inputShort" type="text" clearable :readonly="curMemberId != ''" v-model="baseInfoForm.cardno" placeholder="请输入">
								<template slot="append">
									<i title="读卡" class="mkfont duka" style="font-size:22px;color:#1296db;cursor:pointer"></i>
								</template>
							</el-input>
							<el-input v-else :disabled="memberRead" class="inputShort" type="text" clearable :readonly="curMemberId != ''" v-model="baseInfoForm.cardno" placeholder="请输入">
								<template slot="append">
									<i title="读卡" class="mkfont duka" style="font-size:22px;color:#1296db;cursor:pointer"></i>
								</template>
							</el-input>
						</el-form-item>
						<el-form-item label="卡类型">
							<!-- <el-input :disabled="true" class="inputShort" v-model="baseInfoForm.cardtypeid" /> -->
							<mk-select
								:disabled="true"
								url="Publics/Common/Dic/CardType"
								:clearable="false"
								v-model="baseInfoForm.cardtypeid"
								:param="{ rows: 999 }"
								:filter="['cardtypeid', 'cardname']"
								:width="inputShort"
								label="cardname"
								val="cardtypeid"
								@keyup.enter.native="enterEvent"
							></mk-select>
						</el-form-item>
						<el-form-item label="账户余额"><el-input style="width:100px;" type="text" :disabled="true" v-model="baseInfoForm.balance" /></el-form-item>
						<!-- <el-form-item label="会员类型" prop="membertype">
	            <el-select class="inputShort" v-model="baseInfoForm.membertype" placeholder="请选择">
	              <el-option
	                v-for="item in memberTypeSelect"
	                :key="item.membertypeid"
	                :label="item.name"
	                :value="item.membertypeid"
	              ></el-option>
	            </el-select>
	          </el-form-item>-->
						<el-form-item label="记账类型">
							<!-- <el-input :disabled="true" class="inputShort" v-model="baseInfoForm.billingcode" /> -->
							<mk-select
								:disabled="true"
								url="Publics/Common/Dic/MemberBilling"
								:clearable="false"
								v-model="baseInfoForm.billingcode"
								:param="{ codetype: '记账类型' }"
								:filter="['billingcode', 'billingname']"
								:width="inputShort"
								label="billingname"
								val="billingcode"
								@keyup.enter.native="enterEvent"
							></mk-select>
						</el-form-item>
						<el-form-item label="会员等级">
							<mk-select
								:disabled="true"
								url="Publics/MemberManage/Memberlevel"
								:clearable="false"
								v-model="baseInfoForm.memberlevel"
								:filter="['name']"
								:width="inputShort"
								label="name"
								val="levelid"
								@keyup.enter.native="enterEvent"
							></mk-select>
						</el-form-item>
						<el-form-item label="积分余额"><el-input style="width:100px;" type="text" :disabled="true" v-model="baseInfoForm.memberintegral" /></el-form-item>
						<el-form-item :label="registerTyle + '姓名'" prop="membername">
							<el-input :disabled="memberRead" style="width:670px;" type="text" clearable v-model="baseInfoForm.membername" placeholder="请输入" />
						</el-form-item>
						<el-form-item :label="registerTyle + 'ID'"><el-input style="width:100px;" type="text" :disabled="true" v-model="baseInfoForm.memberid" /></el-form-item>
						<el-form-item :label="registerTyle + '姓'" prop>
							<el-input :disabled="memberRead" class="inputShort" type="text" clearable v-model="baseInfoForm.lastname" placeholder="请输入" />
						</el-form-item>
						<el-form-item :label="registerTyle + '名'" prop>
							<el-input :disabled="memberRead" class="inputShort" type="text" clearable v-model="baseInfoForm.firstname" placeholder="请输入" />
						</el-form-item>
					</div>
					<!-- 基本信息表单 头像上传 -->
					<div style="display:flex;position:absolute;right:20px;">
						<img-upload
							:is-delete="memberRead ? false : true"
							:width="themeStyle.width"
							:height="themeStyle.height"
							:limit="1"
							:value="PORTRAITLIST"
							@input="handleMemberPhotoInput"
							img-style="2"
							:is-empty="isPortraitEmpty"
							:uploadByCamera="true"
						></img-upload>
						<div class="biaoqian">
							<i class="mkfont man"></i>
							<i class="mkfont minganbiaoqian"></i>
						</div>
					</div>
					<!-- 基本信息表单 第三部分 -->
					<div :style="{ position: 'absolute', top: themeStyle.top }">
						<el-form-item label="证件类型" prop="idtype">
							<mk-select
								v-model="baseInfoForm.idtype"
								url="1"
								:disabled="registerTyle == '学生'"
								:clearable="false"
								:globalFn="true"
								:param="{ codetype: '证件类型' }"
								:filter="['bzname', 'filterstr']"
								:width="inputShort"
								label="bzname"
								val="bzcode"
								@keyup.enter.native="enterEvent"
								@change="handleChangeIdType"
							></mk-select>
						</el-form-item>
						<el-form-item label="证件号码" prop="idnumber">
							<!-- 当证件类型为身份时显示 -->
							<el-input
								:disabled="baseInfoForm.idtype == '' || memberRead"
								v-if="baseInfoForm.idtype == 1 || baseInfoForm.idtype == '身份证'"
								class="inputShort"
								type="text"
								clearable
								v-model="baseInfoForm.idnumber"
								@change="handleOnBlurIdnumber"
								@keyup.enter.native="handleIdNumberEnter($event)"
								placeholder="请输入"
							>
								<template slot="append">
									<i title="读取二代身份证" class="mkfont erdaishenfenzheng" style="font-size:22px;color:#1296db;cursor:pointer"></i>
								</template>
							</el-input>
							<!-- 证件类型不为身份证显示 -->
							<el-input
								:disabled="baseInfoForm.idtype == '' || memberRead"
								v-else
								class="inputShort"
								type="text"
								clearable
								v-model="baseInfoForm.idnumber"
								@keyup.enter.native="handleIdNumberEnter($event)"
								placeholder="请输入"
							></el-input>
						</el-form-item>
						<el-form-item :label="registerTyle + '性别'" prop="sex">
							<mk-select
								:disabled="sexDisabled"
								:globalFn="true"
								url="1"
								:clearable="false"
								v-model="baseInfoForm.sex"
								:param="{ codetype: '性别' }"
								:filter="['bzname', 'filterstr']"
								:width="inputShort"
								label="bzname"
								val="bzcode"
								@keyup.enter.native="enterEvent"
							></mk-select>
						</el-form-item>
						<el-form-item :label="registerTyle + '生日'" prop="birthday">
							<el-date-picker
								:disabled="memberRead"
								class="inputShort"
								v-model="baseInfoForm.birthday"
								@change="handleChangeMemberBirthday"
								@keyup.enter.native="keyupBrithdayEnter($event)"
								type="date"
								placeholder="选择日期"
							></el-date-picker>
						</el-form-item>
						<el-form-item label="出生时间" v-if="registerTyle == '会员'">
							<el-input :readonly="true" class="inputShort">
								<el-checkbox :disabled="memberRead" slot="prefix" v-model="baseInfoForm.newbaby" />
								<el-time-picker
									slot="suffix"
									style="width:250px; transform: translateX(5px);"
									v-model="birthtime"
									@change="handleChangeBrithTime"
									@keyup.enter.native="keyupBrithTimeEnter($event)"
									value-format="HH:mm:ss"
									:disabled="baseInfoForm.newbaby == 0 || memberRead"
									:picker-options="{
										selectableRange: '00:00:00 - 23:59:59'
									}"
									placeholder="选择时间"
								></el-time-picker>
							</el-input>
						</el-form-item>
						<el-form-item :label="registerTyle + '年龄'" prop="age"><el-input :disabled="true" class="inputShort" v-model="baseInfoForm.age" /></el-form-item>
						<el-form-item :label="(registerTyle == '学生' ? '家长' : '会员') + '手机'" prop="mobiletel">
							<el-input :disabled="memberRead" class="inputShort" type="text" clearable v-model="baseInfoForm.mobiletel" placeholder="请输入" />
						</el-form-item>
						<el-form-item label="联系座机" prop="landline" v-if="registerTyle == '会员'">
							<el-input :disabled="memberRead" class="inputShort" type="text" clearable v-model="baseInfoForm.landline" placeholder="请输入" />
						</el-form-item>
						<el-form-item label="联系邮箱" prop="email" v-if="registerTyle == '会员'">
							<el-input :disabled="memberRead" clearable class="inputShort" v-model="baseInfoForm.email" placeholder="请输入" />
						</el-form-item>
						<el-form-item label="学生学校" v-if="registerTyle == '学生'" prop="forgid">
							<!-- <mk-select
								url="/Publics/Common/Dic/HospitalOrgan"
								:clearable="true"
								:param="{ flgtree: 1 }"
								v-model="baseInfoForm.forgid"
								:filter="['orgname']"
								width="280px"
								label="orgname"
								val="orgid"
								@change="handleChangeSchool"
							></mk-select> -->
							<el-select style="width:280px" placeholder="请选择学校" filterable :clearable="true" v-model="baseInfoForm.forgid" @change="handleChangeSchool">
								<el-option v-for="item in schoolList" :key="item.orgid" :label="item.orgname" :value="item.orgid" />
							</el-select>
						</el-form-item>
						<el-form-item label="学生班级" v-if="registerTyle == '学生'" prop="orgid">
							<el-select
								style="width:280px"
								:disabled="!baseInfoForm.forgid"
								:placeholder="baseInfoForm.forgid ? '请选择班级' : '请先选择学校'"
								:clearable="true"
								filterable
								v-model="baseInfoForm.orgid"
								@change="handleChangeClass"
							>
								<el-option v-for="item in classList" :key="item.orgid" :label="item.orgname" :value="item.orgid" />
							</el-select>
						</el-form-item>
						<el-form-item v-if="registerTyle == '学生'"><div class="inputShort" style="height: 18px;"></div></el-form-item>
						<el-form-item label="国籍" prop>
							<mk-select
								:disabled="memberRead"
								v-model="baseInfoForm.country"
								url="1"
								:clearable="false"
								:globalFn="true"
								:param="{ codetype: '国家' }"
								:filter="['bzname', 'filterstr']"
								:width="inputShort"
								label="bzname"
								val="bzcode"
								@keyup.enter.native="enterEvent"
							></mk-select>
						</el-form-item>
						<el-form-item label="民族" prop>
							<mk-select
								:disabled="memberRead"
								v-model="baseInfoForm.nation"
								url="1"
								:clearable="false"
								:globalFn="true"
								:param="{ codetype: '民族' }"
								:filter="['bzname', 'filterstr']"
								:width="inputShort"
								label="bzname"
								val="bzcode"
								@keyup.enter.native="enterEvent"
							></mk-select>
						</el-form-item>
						<el-form-item label="宗教信仰" prop>
							<mk-select
								:disabled="memberRead"
								v-model="baseInfoForm.religion"
								url="1"
								:clearable="false"
								:globalFn="true"
								:param="{ codetype: '宗教信仰' }"
								:filter="['bzname', 'filterstr']"
								:width="inputShort"
								label="bzname"
								val="bzcode"
								@keyup.enter.native="enterEvent"
							></mk-select>
						</el-form-item>
						<el-form-item label="婚姻状况" prop v-if="registerTyle == '会员'">
							<mk-select
								:disabled="memberRead"
								v-model="baseInfoForm.marriage"
								url="1"
								:clearable="false"
								:globalFn="true"
								:param="{ codetype: '婚姻' }"
								:filter="['bzname', 'filterstr']"
								:width="inputShort"
								label="bzname"
								val="bzcode"
								@keyup.enter.native="enterEvent"
							></mk-select>
						</el-form-item>
						<el-form-item label="所属血型" prop>
							<mk-select
								:disabled="memberRead"
								v-model="baseInfoForm.bloodgroup"
								url="1"
								:clearable="false"
								:globalFn="true"
								:param="{ codetype: '血型' }"
								:filter="['bzname', 'filterstr']"
								:width="inputShort"
								label="bzname"
								val="bzcode"
								@keyup.enter.native="enterEvent"
							></mk-select>
						</el-form-item>
						<el-form-item label="RH血型" prop>
							<mk-select
								:disabled="memberRead"
								v-model="baseInfoForm.bloodrh"
								url="1"
								:clearable="false"
								:globalFn="true"
								:param="{ codetype: 'RH血型' }"
								:filter="['bzname', 'filterstr']"
								:width="inputShort"
								label="bzname"
								val="bzcode"
								@keyup.enter.native="enterEvent"
							></mk-select>
						</el-form-item>
						<el-form-item label="使用语种" prop>
							<mk-select
								:disabled="memberRead"
								v-model="baseInfoForm.language"
								url="1"
								:globalFn="true"
								:clearable="false"
								:param="{ codetype: '语言' }"
								:filter="['bzname', 'filterstr']"
								:width="inputShort"
								label="bzname"
								val="bzcode"
								@keyup.enter.native="enterEvent"
							></mk-select>
						</el-form-item>
						<el-form-item label="来源渠道" v-if="registerTyle == '会员'">
							<mk-select
								:disabled="memberRead"
								v-model="baseInfoForm.sourceid"
								url="1"
								:clearable="false"
								:globalFn="true"
								:param="{ codetype: '来源渠道' }"
								:filter="['bzname', 'filterstr']"
								:width="inputShort"
								label="bzname"
								val="bzcode"
								@keyup.enter.native="enterEvent"
								@change="handleChangeSource"
							></mk-select>
						</el-form-item>
						<el-form-item :label="sourcenoteLabel" v-if="(sourceCode == 1 || sourceCode == 2) && registerTyle == '会员'">
							<el-input class="inputShort" type="text" clearable v-model="baseInfoForm.sourcenote" placeholder="请输入" />
						</el-form-item>
						<el-form-item :label="sourcenoteLabel" v-if="sourceCode == 3">
							<!-- 活动 -->
							<el-select style="width: 280px;" clearable v-model="baseInfoForm.sourcenote">
								<el-option v-for="item in HospitalEvents" :value="item.eventname" :label="item.eventname" :key="item.eventid"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item :label="sourcenoteLabel" v-if="(sourceCode == 4 || sourceCode == 5) && registerTyle == '会员'">
							<!-- 单位、保险 -->
							<mk-select
								url="/Publics/Common/Dic/HospitalOrgan"
								:clearable="true"
								v-model="baseInfoForm.sourcenote"
								:filter="['orgname']"
								width="280px"
								label="orgname"
								val="orgname"
							></mk-select>
						</el-form-item>
						<el-form-item label="从事职业" prop v-if="registerTyle == '会员'">
							<mk-select
								:disabled="memberRead"
								v-model="baseInfoForm.profession"
								url="1"
								:clearable="false"
								:globalFn="true"
								:param="{ codetype: '职业' }"
								:filter="['bzname', 'filterstr']"
								width="280px"
								label="bzname"
								val="bzcode"
								@keyup.enter.native="enterEvent"
							></mk-select>
						</el-form-item>
						<el-form-item label="工作单位" prop v-if="registerTyle == '会员'">
							<el-input :disabled="memberRead" class="inputLong" v-model="baseInfoForm.compangname" placeholder="请输入" />
						</el-form-item>
						<el-form-item label="现居地" prop>
							<el-cascader
								:disabled="memberRead"
								class="inputShort"
								clearable
								v-model="CurCityData"
								:options="$countyData"
								filterable
								:props="optionsConfig"
								@change="handleChangeCurCity"
							/>
						</el-form-item>
						<el-form-item label="现居地地址"><el-input :disabled="memberRead" class="inputLong" v-model="baseInfoForm.currentaddress" placeholder="请输入" /></el-form-item>
					</div>
				</el-form>
				<el-button-group v-if="!memberRead" style="position:absolute; bottom: -60px; left:43%;">
					<el-button type="primary" @click="handleSubmitMemberInfo('base')">提交</el-button>
					<el-button type="warning" @click="memberRegisterModal = false">取消</el-button>
				</el-button-group>
			</div>
		</template>
		<!-- 附加信息 -->
		<template v-if="activeStep == 1">
			<div class="base-info-form" style="height:760px;padding-right:50px;">
				<el-form :model="extraInfoForm" ref="extraInfoForm" label-width="100px" :inline="true">
					<el-form-item label="毕业院校" prop="graduatedschool">
						<el-input :disabled="memberRead" style="width:470px;" v-model="extraInfoForm.graduatedschool" placeholder="请输入" />
					</el-form-item>
					<el-form-item label="最高学历" prop="highesteducation">
						<mk-select
							:disabled="memberRead"
							v-model="extraInfoForm.highesteducation"
							url="1"
							:clearable="false"
							:globalFn="true"
							:param="{ codetype: '最高学历' }"
							:filter="['bzname', 'filterstr']"
							width="470px"
							label="bzname"
							val="bzcode"
							@keyup.enter.native="enterEvent"
						></mk-select>
					</el-form-item>
					<el-form-item label="个人信用" prop="credits">
						<mk-select
							:disabled="memberRead"
							v-model="extraInfoForm.credits"
							url="1"
							:clearable="false"
							:globalFn="true"
							:param="{ codetype: '个人信用' }"
							:filter="['bzname', 'filterstr']"
							width="470px"
							label="bzname"
							val="bzcode"
							@keyup.enter.native="enterEvent"
						></mk-select>
					</el-form-item>
					<el-form-item label="收入范围" prop="income">
						<mk-select
							:disabled="memberRead"
							v-model="extraInfoForm.yearsalary"
							url="1"
							:clearable="false"
							:globalFn="true"
							:param="{ codetype: '年薪范围' }"
							:filter="['bzname', 'filterstr']"
							width="470px"
							label="bzname"
							val="bzcode"
							@keyup.enter.native="enterEvent"
						></mk-select>
					</el-form-item>
					<el-form-item label="个人偏好">
						<el-input :disabled="memberRead" style="width:1050px" type="textarea" :autosize="{ minRows: 4, maxRows: 6 }" v-model="extraInfoForm.preference" placeholder="请输入" />
					</el-form-item>
					<el-form-item label="过敏史">
						<el-input
							:disabled="memberRead"
							style="width:1050px"
							type="textarea"
							:autosize="{ minRows: 4, maxRows: 6 }"
							v-model="extraInfoForm.allergyhistory"
							placeholder="请输入"
						/>
					</el-form-item>
					<el-form-item label="既往史">
						<el-input :disabled="memberRead" style="width:1050px" type="textarea" :autosize="{ minRows: 4, maxRows: 6 }" v-model="extraInfoForm.pasthistory" placeholder="请输入" />
					</el-form-item>
					<el-form-item label="家族史">
						<el-input
							:disabled="memberRead"
							style="width:1050px"
							type="textarea"
							:autosize="{ minRows: 4, maxRows: 6 }"
							v-model="extraInfoForm.genetichistory"
							placeholder="请输入"
						/>
					</el-form-item>
					<el-form-item label="旅行史">
						<el-input
							:disabled="memberRead"
							style="width:1050px"
							type="textarea"
							:autosize="{ minRows: 4, maxRows: 6 }"
							v-model="extraInfoForm.travelhistory"
							placeholder="请输入"
						/>
					</el-form-item>
				</el-form>
				<el-button-group v-if="!memberRead" style="position:absolute; bottom:0px; left:43%;">
					<el-button type="primary" @click="handleSubmitMemberInfo('extra')">提交</el-button>
					<el-button type="warning">取消</el-button>
				</el-button-group>
			</div>
		</template>
		<!-- 上传资料 -->
		<template v-if="activeStep == 2">
			<div>
				<el-table :data="uploadTableData" height="720">
					<el-table-column label="证件类型" align="center" prop="idtype_display" />
					<el-table-column label="文件名称" align="center" prop="idname" />
					<el-table-column label="备注" align="center" prop="note" width="400" />
					<el-table-column label="上传时间" align="center" prop="createtime" />
					<el-table-column align="center" width="160">
						<template slot="header">
							<el-button type="primary" :disabled="memberRead" size="mini" @click="handleUploadData">添加</el-button>
						</template>
						<template slot-scope="scope">
							<div class="tableBtn">
								<el-link title="编辑" icon="mkfont bianji1" :underline="false" type="primary" @click="handleUploadDataEdit(scope.row, 0)" />
								<el-link :disabled="memberRead" icon="mkfont trasch" :underline="false" type="danger" @click="handleUploadDataEdit(scope.row, 1)" />
							</div>
						</template>
					</el-table-column>
				</el-table>
				<!-- 资料上传模态框 -->
				<vxe-modal v-model="uploadDataModal" width="860" height="auto">
					<div slot="title">{{ curMemberId ? '新增资料' : '编辑资料' }}</div>
					<el-form :model="uploadDataForm" ref="uploadDataForm" :rules="uploadDataRules" label-width="100px">
						<el-form-item label="证件类型" prop="idtype">
							<mk-select
								:disabled="memberRead"
								v-model="uploadDataForm.idtype"
								url="1"
								:globalFn="true"
								:param="{ codetype: '证件类型' }"
								:filter="['bzname', 'filterstr']"
								width="670px"
								label="bzname"
								val="bzcode"
								@keyup.enter.native="enterEvent"
								@change="handleUploadIdtype"
								placeholder="请选择证件类型"
							></mk-select>
						</el-form-item>
						<el-form-item label="证件名称" prop="idname"><el-input :disabled="true" class="inputLong" v-model="uploadDataForm.idname" placeholder="请选择证件类型" /></el-form-item>
						<el-form-item label="证件号码" prop="idnumber">
							<el-input :disabled="memberRead" class="inputLong" v-model="uploadDataForm.idnumber" placeholder="请输入证件号码" />
						</el-form-item>
						<el-form-item label="证件图片" prop>
							<template>
								<div style="display:flex;">
									<img-upload
										style="margin-right:20px;"
										:is-delete="memberRead ? false : true"
										@input="handleUploadInput"
										:value="PHTOTLIST1"
										img-style="1"
										:limit="1"
										:is-empty="isEmpty"
										:uploadByCamera="true"
									></img-upload>
									<img-upload
										:is-delete="memberRead ? false : true"
										@input="handleUploadInput2"
										:value="PHTOTLIST2"
										img-style="1"
										:limit="1"
										:is-empty="isEmpty"
										:uploadByCamera="true"
									></img-upload>
								</div>
							</template>
						</el-form-item>
						<el-form-item label="备注" prop="note">
							<el-input :disabled="memberRead" type="textarea" class="inputLong" v-model="uploadDataForm.note" placeholder="请输入" />
						</el-form-item>
					</el-form>
					<el-button-group v-if="!memberRead" style="margin-left:40%;">
						<el-button type="primary" @click="handleUploadIDInfo">提交</el-button>
						<el-button type="warning" @click="uploadDataModal = false">取消</el-button>
					</el-button-group>
				</vxe-modal>
			</div>
		</template>
		<!-- 家庭成员 -->
		<template v-if="activeStep == 3">
			<div style="position:relative">
				<el-table :data="familyTableData" stripe height="720">
					<el-table-column label="成员关系" prop="membership_display" align="center" />
					<el-table-column label="成员姓名" prop="membername" align="center" />
					<el-table-column label="成员性别" prop="sex_display" align="center" />
					<el-table-column label="成员生日" prop="birthday" align="center" />
					<el-table-column label="联系手机" prop="mobiletel" align="center" />
					<el-table-column label="状态" align="center">
						<template slot-scope="scope">
							<el-tag :type="GetvalidStatusType(scope.row.status)">{{ scope.row.status == 0 ? '停用' : '正常' }}</el-tag>
						</template>
					</el-table-column>
					<el-table-column align="center" width="120">
						<template slot="header">
							<el-button type="primary" :disabled="memberRead" @click="handleOpenAddFamilyModal">添加</el-button>
						</template>
						<template slot-scope="scope">
							<div class="tableBtn">
								<el-link icon="mkfont bianji1" :underline="false" type="primary" @click="handleFamilyMemberEdit(scope.row, 'U')" />
								<el-link :disabled="memberRead" icon="mkfont trasch" title="删除" :underline="false" type="danger" @click="handleFamilyMemberEdit(scope.row, 'D')" />
							</div>
						</template>
					</el-table-column>
				</el-table>
				<el-button v-if="!memberRead" style="position: absolute; bottom: -60px; left:47.5%" type="success" @click="memberRegisterModal = false">完成</el-button>
			</div>
		</template>
		<!-- 紧急联系人 -->
		<template v-if="activeStep == 4">
			<div style="position:relative">
				<el-table :data="memberContactTableData" stripe height="700">
					<el-table-column label="联系人关系" prop="contactship_display" align="center" />
					<el-table-column label="联系人姓名" prop="contactname" align="center" />
					<el-table-column label="联系手机" prop="mobiletel" align="center" />
					<el-table-column label="联系地址" prop="address" align="center" width="300" />
					<el-table-column label="创建时间" prop="createtime" align="center" />
					<!-- <el-table-column label="状态" align="center">
	          <template slot-scope="scope">
	            <el-tag
	              :type="GetvalidStatusType(scope.row.status)"
	            >{{scope.row.status == 0 ? '停用' : '正常'}}</el-tag>
	          </template>
	        </el-table-column>-->
					<el-table-column align="center" width="120">
						<template slot="header">
							<el-button type="primary" :disabled="memberRead" @click="handleOpenAddContactModal">添加</el-button>
						</template>
						<template slot-scope="scope">
							<div class="tableBtn">
								<el-link icon="mkfont bianji1" :underline="false" type="primary" @click="handleContactMemberEdit(scope.row, 'U')" />
								<el-link :disabled="memberRead" icon="mkfont trasch" title="删除" :underline="false" type="danger" @click="handleContactMemberEdit(scope.row, 'D')" />
							</div>
						</template>
					</el-table-column>
				</el-table>
				<el-button v-if="!memberRead" style="position: absolute; bottom: -60px; left:47.5%" type="success" @click="memberRegisterModal = false">完成</el-button>
			</div>
		</template>
		<!-- 联系人模态框 -->
		<vxe-modal v-model="contactModal" title="紧急联系人" width="540" height="auto" :show-footer="true">
			<el-form :model="contactForm" ref="contactForm" :rules="contactRule" label-width="140px">
				<el-form-item label="联系人姓名" prop="contactname">
					<el-input :disabled="memberRead" class="inputShort" v-model="contactForm.contactname" placeholder="请输入" />
				</el-form-item>
				<el-form-item label="联系人关系" prop="contactship">
					<mk-select
						:disabled="memberRead"
						v-model="contactForm.contactship"
						url="1"
						:globalFn="true"
						:param="{ codetype: '成员关系' }"
						:filter="['bzname', 'filterstr']"
						:width="inputShort"
						label="bzname"
						val="bzcode"
						@keyup.enter.native="enterEvent"
					/>
				</el-form-item>
				<el-form-item label="联系手机" prop="mobiletel"><el-input :disabled="memberRead" class="inputShort" v-model="contactForm.mobiletel" placeholder="请输入" /></el-form-item>
				<el-form-item label="联系地址"><el-input :disabled="memberRead" class="inputShort" v-model="contactForm.address" placeholder="请输入" /></el-form-item>
			</el-form>
			<div slot="footer" class="footer">
				<el-button-group>
					<el-button type="primary" @click="handleContactSubmit">提交</el-button>
					<el-button type="warning" @click="contactModal = false">取消</el-button>
				</el-button-group>
			</div>
		</vxe-modal>
	</vxe-modal>
</template>

<script>
import imgUpload from '@/components/mk-form/Upload/index.vue';
// 手机号验证
const checkPhone = (rule, value, callback) => {
	const phoneReg = /^1[3|4|5|6|7|8][0-9]{9}$/;
	if (!value) {
		return callback(new Error('联系手机不能为空'));
	}
	setTimeout(() => {
		if (!Number.isInteger(+value)) {
			callback(new Error('请输入数字'));
		} else {
			if (phoneReg.test(value)) {
				callback();
			} else {
				callback(new Error('联系手机格式不正确'));
			}
		}
	}, 200);
};
// 座机校验
const landline = (rule, value, callback) => {
	const reg = /^([0-9]{3,4}-)?[0-9]{7,8}$/;
	if (value != '') {
		setTimeout(() => {
			if (reg.test(value)) {
				callback();
			} else {
				callback(new Error('联系座机格式不正确001-1234567 或 001-12345678'));
			}
		}, 200);
	} else {
		callback();
	}
};
// 邮箱校验
const checkMail = (rule, value, callback) => {
	const reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
	if (value != '') {
		setTimeout(() => {
			if (reg.test(value)) {
				callback();
			} else {
				callback(new Error('邮箱格式不正确'));
			}
		}, 200);
	} else {
		callback();
	}
};
// 纯数字校验
const checkNumber = (rule, value, callback) => {
	setTimeout(() => {
		if (isNaN(value)) {
			callback(new Error('请输入数字'));
		} else {
			callback();
		}
	}, 200);
};
// 金额校验
const money = (rule, value, callback) => {
	setTimeout(() => {
		var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
		if (reg.test(value)) {
			callback();
		} else {
			callback(new Error('金额格式错误'));
		}
	}, 200);
};
export default {
	computed: {
		// 会员基本信息第三部分 top值根据主题大小改变自适应
		themeStyle() {
			if (this.$ELEMENT.size == 'mini') {
				return { top: '200px', width: 120, height: 140 };
			} else if (this.$ELEMENT.size == 'small') {
				return { top: '220px', width: 120, height: 140 };
			} else if (this.$ELEMENT.size == 'medium') {
				return { top: '230px', width: 120, height: 145 };
			} else {
				return { top: '250px', width: 125, height: 160 };
			}
		},
		sourcenoteLabel: {
			get() {
				if (this.sourceCode == 1) {
					return '慕名备注';
				}
				if (this.sourceCode == 2) {
					return '介绍人姓名';
				}
				if (this.sourceCode == 3) {
					return '活动类型';
				}
				if (this.sourceCode == 4) {
					return '单位名称';
				}
				if (this.sourceCode == 5) {
					return '保险名称';
				}
			},
			set(val) {}
		},
		isHospitalid() {
			if (this.baseInfoForm.forgid) {
				return '/Publics/Common/Dic/HospitalOrgan';
			} else {
				return '';
			}
		}
	},
	props: {
		userData: {
			type: Object,
			default: () => {}
		},
		method: {
			type: Function,
			default: null
		},
		cardLabel: {
			type: String,
			default: '会员卡号'
		},
		registerTyle: {
			type: String,
			default: '会员'
		}
	},
	data() {
		// 获取当前日期 格式 20200501
		const curDate = this.getCurDate();
		// 证件校验 包含身份证
		const checkIDCard = (rule, value, callback) => {
			const regIdCard = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
			if (this.baseInfoForm.idtype == 1 || this.baseInfoForm.idtype == '身份证') {
				if (!value) {
					return callback(new Error('身份证号不能为空'));
				}
				setTimeout(() => {
					if (!regIdCard.test(value)) {
						return callback(new Error('身份证号填写有误'));
					} else {
						callback();
					}
				}, 200);
			} else {
				if (!value) {
					callback(new Error('证件号不能为空'));
				}
				var reg = /^[a-zA-Z0-9]+$/;
				if (!reg.test(value)) {
					callback(new Error('请输入字母或数字组成的证件号'));
				} else {
					callback();
				}
			}
		};
		return {
			drawer: false,
			curRowData: {},
			optionsConfig: {
				value: 'code',
				label: 'name',
				children: 'children'
			},
			HospitalEvents: [],
			classesList: [], // 班级
			memberRead: false, //查看会员信息
			switch: '',
			birthtime: '',
			cameraStatus: 0,
			fromCamera: false, // 拍照
			sexDisabled: false, //性别控件 disabled
			base64Code: '',
			sourceCode: 1,
			memberContactTableData: [],
			PORTRAITLIST: [],
			PHTOTLIST1: [],
			PHTOTLIST2: [],
			isPortraitEmpty: false, // 是否清空头像图片
			isEmpty: false, // 是否清空证件图片
			isNewMember: false,
			myCustomer: '', //我的客户
			pastShipFee: '', // 会费近期
			newMemberId: '', // 新建一个会员id
			curSERIALNUMBER: '', //当前家庭成员SERIALNUMBER
			curMemberId: '', // 当前会员id
			curFamilyMemberStatus: '', //当前家庭成员状态
			curImgUrl: [], // 当前图片地址
			curImgUrl2: [], // 当前图片地址
			curUploadStatus: '', // 当前上传证件状态
			curContactRow: '', // 当前联系人row
			inputShort: '280px', // 下拉框宽度
			HomeCityData: [], // 籍贯数据
			BrithCityData: [], // 出生地数据
			RegCityData: [], // 户口数据
			CurCityData: [], //现居地
			imageUrl: '',
			checkedLevel: [], // 选中的等级
			memberTypeSelect: [],
			memberLevelSelect: [],
			customManagerList: [],
			cameraModal: true,
			memberRegisterModal: false, // 注册会员模态框开关
			openAddFamilyModal: false, // 家庭成员模态框开关
			uploadDataModal: false, // 上传资料模态框开关
			changeManagerModal: false,
			dialogImageUrl: '',
			dialogVisible: false,
			contactModal: false,
			// 查询条件
			searchCondition: {
				condition: ''
			},
			changeManagerForm: {
				curManager: ''
			},
			contactForm: {
				contactname: '',
				contactship: '',
				address: '',
				mobiletel: ''
			},
			contactRule: {
				contactname: [{ required: true, message: '请输入联系人姓名', trigger: 'blur' }],
				contactship: [{ required: true, message: '请选择联系人关系', trigger: 'change' }],
				mobiletel: [{ required: true, message: '请输入联系手机', trigger: 'blur' }, { required: true, validator: checkPhone, trigger: 'blur' }]
			},
			// 会员信息表格
			tableData: [],
			// 成员表格
			familyTableData: [],
			// 上传资料表格
			uploadTableData: [],
			pager: {
				count: 0,
				page: 1,
				rows: 20,
				CONDITION: ''
			},
			activeStep: 0, // 当前注册步骤
			// 会员基本信息表单
			baseInfoForm: {
				memberid: '',
				managerid: '', //客户经理
				cardno: '', // 卡号
				studentno:'',// 学号
				headhouse: '是', //户主标识
				membertype: '', // 类型
				memberlevel: '', // 等级
				membername: '', // 会员姓名
				billingcode: '', // 记账类型
				cardtypeid: '', // 卡类型
				lastname: '', // 姓
				firstname: '', // 名
				sex: '',
				age: '',
				birthday: '',
				newbaby: 0, // 新生鹅
				birthtime: '', // 出生时间
				idtype: '1', // 证件类型
				idnumber: '', // 证件号码
				idsource: '', // 证件来源
				sourceid: '', // 渠道
				sourcenote: '', //推荐人
				idphoto: '', // 证件照地址
				country: '',
				nation: '',
				bloodgroup: '', // 血型
				bloodrh: '', //rh血型
				marriage: '', // 婚姻
				profession: '', // 职位
				landline: '', // 联系手机
				mobiletel: '', // 联系手机
				email: '',
				postcode: '',
				address: '',
				language: '',
				healthno: '', //健康卡号
				religion: '', // 宗教
				infosource: 0, // 信息来源
				idsource: 0,
				hometownprovince: '', //籍贯省
				hometowncity: '', //籍贯市
				hometowncounty: '', //籍贯县
				bornprovince: '', // 出生地省
				borncity: '', // 出生地市
				borncounty: '', // 出生地县
				bornstreet: '', // 出生街道
				bornaddress: '', // 出生地地址
				regprovince: '', // 户口地省
				regcity: '', // 户口地市
				regcounty: '', // 户口地省
				regstreet: '', // 户口街道
				regaddress: '', // 户口地地址
				currentprovince: '', // 现住地省
				currentcity: '', //现住地市
				currentcounty: '', // 现住地县
				currentstreet: '', // 现住地街道
				currentaddress: '', // 现住地地址
				compangcode: '', //单位代码
				compangname: '', //单位名称
				compangemail: '', //单位邮箱
				compangline: '', //单位电话
				compangaddress: '', // 单位地址
				memberintegral: 0, //积分
				balance: 0, // 余额
				orgid: '',
				orgname: '',
				forgid: '',
				forgname: ''
			},
			// 家庭成员表单
			familyForm: {
				memberid: '',
				membership: '',
				familymemberid: '',
				familymembername: ''
			},
			// 附加信息表单
			extraInfoForm: {
				highesteducation: '', // 最高学历
				graduatedschool: '', //毕业院校
				credits: '', // 个人信用
				yearsalary: '', // 收入范围
				securitylevel: '', // 保密级别
				allergyhistory: '', // 过敏史
				pasthistory: '', // 既往史
				genetichistory: '', //家族史
				travelhistory: '', //旅行史
				preference: '', //个人偏好
				// effectivedate: curDate, // 生效日期
				// expirationdate: '20991231' // 失效日期
				effectivedate: '', // 生效日期
				 expirationdate: '' // 失效日期
			},
			// 上传资料表单
			uploadDataForm: {
				idtype: '',
				idname: '',
				idnumber: '',
				note: '',
				idphoto: []
			},
			// 上传资料单表校验
			uploadDataRules: {
				idtype: [{ required: true, message: '请选择证件类型', trigger: 'change' }],
				idname: [{ required: true, message: '请输入证件名称', trigger: 'blur' }],
				idnumber: [{ required: true, message: '请输入证件号码', trigger: 'blur' }, { required: true, validator: checkNumber, trigger: 'blur' }],
				idphoto: [{ required: true, message: '请上传图片', trigger: 'change' }]
			},
			// 会员基本信息表单校验
			baseInfoRules: {
				managerid: [{ required: true, message: '请选择客户经理', trigger: 'change' }],
				cardtypeid: [{ required: true, message: '请选择卡类型', trigger: 'change' }],
				billingcode: [{ required: true, message: '请选择记账类型', trigger: 'change' }],
				age: [{ required: true, message: '请输入会员年龄', trigger: 'blur' }],
				cardno: [{ required: true, message: '请输入卡号', trigger: 'blur' }],
				membertype: [{ required: true, message: '请选择会员类型', trigger: 'change' }],
				membername: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
				sex: [{ required: true, message: '请选择性别', trigger: 'change' }],
				birthday: [{ required: true, message: '请选择生日', trigger: 'blur' }, { required: true, message: '请选择会员生日', trigger: 'change' }],
				idtype: [{ required: true, message: '请选择证件类型', trigger: 'change' }],
				forgid: [{ required: true, message: '请选择学校', trigger: 'change' }],
				orgid: [{ required: true, message: '请选择班级', trigger: 'change' }],
				idnumber: [{ required: true, validator: checkIDCard, trigger: 'blur' }],
				mobiletel: [{ required: true, validator: checkPhone, trigger: 'blur' }],
				landline: [{ validator: landline, trigger: 'blur' }],
				email: [{ validator: checkMail, trigger: 'blur' }]
			},
			// 家庭成员表单校验
			familyRules: {
				familymembername: [{ required: true, message: '请选择成员姓名', trigger: 'change' }],
				membership: [{ required: true, message: '请选择成员关系', trigger: 'change' }]
			},
			membershipid: [],
			memberTypeArr: [],
			memberLevelArr: [],
			memberStatusArr: [],
			memberBillingList: [], //记账类型
			cardTypeList: [],
			test: '',
			size: '', // 主题 size 影响控件高度
			schoolList: [],
			classList: []
		};
	},
	components: {
		imgUpload
	},
	created() {
		this.Membertype_Get();
		this.Memberlevel_Get();
		this.Member_AccountManager_Get();
		// this.MemberInfo_Get();
		this.schoolByAccount_get();
		this.membershipid = this.getDicStandarDcode('成员关系');
		this.memberStatusArr = this.GetTablefilters('状态');
	},
	methods: {
		async open() {
			this.memberRegisterModal = true;
			this.events_Get();
		},
		// 表格行排序
		rowSort(a, b) {
			let sort1 = a.memberlevel;
			let sort2 = b.memberlevel;
			return sort1 - sort2;
		},
		init() {
			this.$nextTick(() => {
				this.$refs.baseInfoForm.clearValidate();
			});
			this.isPortraitEmpty = true;
			this.isNewMember = true;
			this.MK.Request('Publics/Common/Sequence', 'get', {
				SequenceName: 's_member_memberinfo_memberid'
			}).then(res => {
				this.newMemberId = res.seed;
				this.baseInfoForm.memberid = res.seed;
			});
			this.sourceCode = 1;
			this.activeStep = 0;
			this.memberRegisterModal = true;
			this.sexDisabled = false;
			this.memberRead = false;
			this.curMemberId = '';
			this.curRowData = {};
			this.switch = '';
			this.PORTRAITLIST = [];
			this.isSubmitBasicInfo = false;
			// 基础信息
			this.baseInfoForm.memberid = '';
			this.baseInfoForm.managerid = '10001';
			this.baseInfoForm.cardno = '';
			this.baseInfoForm.studentno = '';
			this.baseInfoForm.cardtypeid = 1;
			this.baseInfoForm.billingcode = 10;
			this.baseInfoForm.headhouse = '0';
			this.baseInfoForm.membertype = '1';
			this.baseInfoForm.memberlevel = 1;
			this.baseInfoForm.membername = '';
			this.baseInfoForm.memberintegral = '';
			this.baseInfoForm.lastname = '';
			this.baseInfoForm.firstname = '';
			this.baseInfoForm.sex = '0';
			this.baseInfoForm.age = '';
			this.baseInfoForm.birthday = '';
			this.baseInfoForm.birthtime = '';
			this.baseInfoForm.newbaby = 0;
			this.baseInfoForm.idtype = '1';
			this.baseInfoForm.idnumber = '';
			this.baseInfoForm.sourcenote = '';
			this.baseInfoForm.idphoto = '';
			this.baseInfoForm.country = '142';
			this.baseInfoForm.nation = '1';
			this.baseInfoForm.bloodgroup = '9';
			this.baseInfoForm.bloodrh = '0';
			this.baseInfoForm.marriage = '90';
			this.baseInfoForm.profession = '90';
			this.baseInfoForm.landline = '';
			this.baseInfoForm.mobiletel = '';
			this.baseInfoForm.email = '';
			this.baseInfoForm.postcode = '';
			this.baseInfoForm.address = '';
			this.baseInfoForm.sourceid = '1';
			this.baseInfoForm.language = '0';
			this.baseInfoForm.healthno = '';
			this.baseInfoForm.religion = '0';
			this.baseInfoForm.hometownprovince = '';
			this.baseInfoForm.hometowncity = '';
			this.baseInfoForm.hometowncounty = '';
			this.baseInfoForm.bornprovince = '';
			this.baseInfoForm.borncity = '';
			this.baseInfoForm.borncounty = '';
			this.baseInfoForm.bornstreet = '';
			this.baseInfoForm.bornaddress = '';
			this.baseInfoForm.regprovince = '';
			this.baseInfoForm.regcity = '';
			this.baseInfoForm.regcounty = '';
			this.baseInfoForm.regstreet = '';
			this.baseInfoForm.regaddress = '';
			this.baseInfoForm.currentprovince = '';
			this.baseInfoForm.currentcity = '';
			this.baseInfoForm.currentcounty = '';
			this.baseInfoForm.currentstreet = '';
			this.baseInfoForm.currentaddress = '';
			this.baseInfoForm.compangcode = '';
			this.baseInfoForm.compangname = '';
			this.baseInfoForm.compangemail = '';
			this.baseInfoForm.compangline = '';
			this.baseInfoForm.compangaddress = '';
			this.baseInfoForm.balance = 0;
			this.baseInfoForm.memberintegral = 0;
			this.baseInfoForm.orgid = '';
			this.baseInfoForm.orgname = '';
			this.baseInfoForm.forgid = '';
			this.baseInfoForm.forgname = '';
			// 附加信息
			this.extraInfoForm.highesteducation = '0';
			this.extraInfoForm.graduatedschool = '';
			this.extraInfoForm.credits = '0';
			this.extraInfoForm.yearsalary = '0';
			this.extraInfoForm.allergyhistory = '';
			this.extraInfoForm.pasthistory = '';
			this.extraInfoForm.genetichistory = '';
			this.extraInfoForm.travelhistory = '';
			this.extraInfoForm.preference = '';
			this.extraInfoForm.securitylevel = '0';
			// 地址信息
			this.HomeCityData = '';
			this.RegCityData = '';
			this.CurCityData = '';
			this.BrithCityData = '';
		},
		handleChangeStep(step) {
			if (
				this.baseInfoForm.cardno == '' ||
				this.baseInfoForm.membername == '' ||
				this.baseInfoForm.idtype == '' ||
				this.baseInfoForm.idnumber == '' ||
				this.baseInfoForm.sex == '' ||
				this.baseInfoForm.birthday == '' ||
				this.baseInfoForm.mobiletel == ''
			) {
				this.$message({
					message: '请您完成必填项并提交，再进行下一步填写',
					type: 'warning'
				});
			} else {
				if (this.isSubmitBasicInfo) {
					this.activeStep = step;
				} else {
					this.$message({
						message: '请您提交基本信息',
						type: 'warning'
					});
				}
			}
			if (this.activeStep == 2) {
				this.Member_certificate_Get();
			}
			if (this.activeStep == 3) {
				this.Member_family_Get();
			}
			if (this.activeStep == 4) {
				this.Member_contact_Get();
			}
		},
		// 新增、编辑会员提交
		handleSubmitMemberInfo(key) {
			this.BasicInfo(key);
		},
		BasicInfo(key) {
			const url = this.curMemberId ? 'Publics/MemberManage/BasicInfo/Edit' : 'Publics/MemberManage/BasicInfo';
			const data = Object.assign(this.baseInfoForm, this.extraInfoForm);
			data.memberid = this.newMemberId;
			data.createuserid = this.info.userid;
			data.createhospitl = this.info.hospitalid;
			data.birthday = this.baseInfoForm.birthday;
			data.securitylevel = 0;
			data.idphoto = this.baseInfoForm.idphoto ? this.baseInfoForm.idphoto.toString() : '';
			data.cardno = this.curRowData.cardno ? this.curRowData.cardno : this.baseInfoForm.cardno;
			data.studentno = this.curRowData.cardno ? this.curRowData.cardno : this.baseInfoForm.cardno;
			data.managerid = this.baseInfoForm.managerid ? this.curRowData.managerid : this.baseInfoForm.managerid;
			data.membertype = '1';
			data.headhouse = this.baseInfoForm.headhouse ? this.curRowData.headhouse : this.baseInfoForm.headhouse;
			data.birthtime = this.baseInfoForm.birthtime;
			data.newbaby = this.baseInfoForm.newbaby ? 1 : 0;
			data.balance = 0;
			data.memberintegral = 0;
			data.idtype = this.baseInfoForm.idtype;
			data.memberlevel = this.baseInfoForm.memberlevel;
			data.country = this.baseInfoForm.country;
			data.nation = this.baseInfoForm.nation;
			data.bloodgroup = this.baseInfoForm.bloodgroup;
			data.bloodrh = this.baseInfoForm.bloodrh;
			data.marriage = this.baseInfoForm.marriage;
			data.profession = this.baseInfoForm.profession;
			data.religion = this.baseInfoForm.religion;
			data.sourceid = this.baseInfoForm.sourceid;
			data.highesteducation = this.extraInfoForm.highesteducation;
			data.credits = this.extraInfoForm.credits;
			data.yearsalary = this.extraInfoForm.yearsalary;
			data.language = this.baseInfoForm.language;
			data.orgid = this.baseInfoForm.orgid;
			data.forgid = this.baseInfoForm.forgid;
			data.cardtypeid = 1;
			data.billingcode = 10;
			// 现居地
			data.currentprovince = this.CurCityData[0];
			data.currentcity = this.CurCityData[1];
			data.currentcounty = this.CurCityData[2];
			if (this.curMemberId) {
				data.memberid = this.curRowData.memberid;
			}
			if (key === 'base') {
				this.$refs['baseInfoForm'].validate(valid => {
					if (valid) {
						this.MK.Request(url, 'post', data).then(res => {
							this.$message({
								message: res.msg,
								type: 'success'
							});
							if (!this.isSubmitBasicInfo) {
								this.isSubmitBasicInfo = true;
								this.$confirm('信息待完善', '提交成功', {
									confirmButtonText: '继续填写',
									cancelButtonText: '关闭窗口',
									type: 'success'
								})
									.then(() => {
										this.activeStep = 1;
									})
									.catch(() => {
										this.memberRegisterModal = false;
									});
							} else {
								this.memberRegisterModal = false;
							}
							setTimeout(() => {
								this.MemberInfo_Get();
								if (this.method) {
									this.method();
								}
							}, 500);
						});
					}
				});
			}
			if (key === 'extra') {
				this.MK.Request(url, 'post', data).then(res => {
					this.$message({
						message: res.msg,
						type: 'success'
					});
					this.memberRegisterModal = false;
					setTimeout(() => {
						this.MemberInfo_Get();
						if (this.method) {
							this.method();
						}
					}, 500);
				});
			}
		},
		// 来源渠道
		handleChangeSource(val) {
			console.log(val);
			this.sourceCode = val.bzcode;
			this.baseInfoForm.sourcenote = '';
		},
		// 证件类型change
		handleChangeIdType(val) {
			console.log(val);
			if (val.bzname == '身份证') {
				this.sexDisabled = true;
			} else {
				this.sexDisabled = false;
			}
			this.baseInfoForm.idnumber = '';
		},
		// 生日回车
		keyupBrithdayEnter(e) {
			e.target.blur();
			this.baseInfoForm.birthday = this.dateFormat(e.target.value);
			this.baseInfoForm.age = this.ageComputed(e.target.value);
		},
		// 更改会员生日
		handleChangeMemberBirthday(val) {
			if (val) {
				const year = val.getFullYear();
				const month = val.getMonth() < 10 ? '0' + (val.getMonth() + 1) : val.getMonth() + 1;
				const day = val.getDate() < 10 ? '0' + val.getDate() : val.getDate();
				this.baseInfoForm.birthday = `${year}-${month}-${day}`;
				const age = this.ageComputed(`${year}${month}${day}`);
				if (age < 0) {
					this.$message({
						message: '会员年龄不能大于当前日期',
						type: 'warning'
					});
					this.baseInfoForm.age = 0;
					this.baseInfoForm.birthday = '';
				} else {
					this.baseInfoForm.age = age;
				}
			} else {
				this.baseInfoForm.birthday = '';
			}
		},
		// 出生时间
		handleChangeBrithTime(time) {
			console.log('s', this.birthtime);
			if (time != null) {
				this.baseInfoForm.birthtime = time.replace(/:/g, '');
			} else {
				this.baseInfoForm.birthtime = '';
			}
		},
		// 出生时间回车
		keyupBrithTimeEnter(e) {
			console.log(e);
			e.target.blur();
		},
		// 身份证回车事件
		handleIdNumberEnter(e) {
			e.target.blur();
		},
		// 身份证获取个人信息
		handleOnBlurIdnumber(idNumber) {
			console.log(idNumber);
			//获取性别
			if (parseInt(idNumber.substr(16, 1)) % 2 == 1) {
				this.baseInfoForm.sex = '1';
			} else {
				this.baseInfoForm.sex = '2';
			}
			// 获取年龄
			var myDate = new Date();
			var month = myDate.getMonth() + 1;
			var day = myDate.getDate();
			var age = myDate.getFullYear() - idNumber.substring(6, 10) - 1;
			if (idNumber.substring(10, 12) < month || (idNumber.substring(10, 12) == month && idNumber.substring(12, 14) <= day)) {
				age++;
			}
			this.baseInfoForm.age = age;
			// 获取生日
			if (idNumber.length == 15) {
				var year = '19' + idNumber.substring(6, 8) + '-' + idNumber.substring(8, 10) + '-' + idNumber.substring(10, 12);
				this.baseInfoForm.birthday = year;
			}

			if (idNumber.length == 18) {
				var year = idNumber.substring(6, 10) + '-' + idNumber.substring(10, 12) + '-' + idNumber.substring(12, 14);
				this.baseInfoForm.birthday = year;
			}
			// 获取籍贯
			var province = idNumber.substring(0, 2).toString();
			var city = idNumber.substring(0, 4).toString();
			var county = idNumber.substring(0, 6).toString();
			this.CurCityData = [province, city, county];
		},
		// 证件上传——更改证件
		handleUploadIdtype(val) {
			this.uploadDataForm.idname = val.bzname;
		},
		// 会员信息补充
		handleMemberMsgSupplement(row) {
			this.MemberInfoByid_Get(row.memberid);
			this.isSubmitBasicInfo = true;
			this.isNewMember = false;
			this.memberRead = false;
			if (row.idtype == 1) {
				this.sexDisabled = true;
			} else {
				this.sexDisabled = false;
			}
			console.log('当前行:', row);
			this.$nextTick(() => {
				this.$refs.baseInfoForm.clearValidate();
			});
		},
		// 添加家庭成员模态框按钮
		handleOpenAddFamilyModal() {
			this.openAddFamilyModal = true;
			this.curMemberId = '';
			this.curSERIALNUMBER = '';
			this.$nextTick(() => {
				this.$refs['familyForm'].clearValidate();
				this.$refs['familyForm'].resetFields();
			});
		},
		// 编辑家庭成员
		handleFamilyMemberEdit(val, key) {
			console.log(val);
			this.curSERIALNUMBER = val.serialnumber;
			this.curMemberId = val.memberid;
			this.familyForm.membership = val.membership_display;
			if (key === 'U') {
				this.openAddFamilyModal = true;
			}
			if (key === 'D') {
				this.familyMember_Operate(key);
			}
		},
		// 联系人提交
		handleContactSubmit(row, key) {
			const data = {
				memberid: this.curRowData.memberid || this.newMemberId,
				contactname: this.contactForm.contactname,
				contactship: this.membershipid.filter(item => {
					if (item.bzcode == this.contactForm.contactship || item.bzname == this.contactForm.contactship) {
						return item;
					}
				})[0].bzcode,
				address: this.contactForm.address,
				mobiletel: this.contactForm.mobiletel
			};
			if (key == 'D') {
				data.operatetype = key;
				data.serialnumber = row.serialnumber;
			} else if (this.curContactRow.contactname) {
				data.serialnumber = this.curContactRow.serialnumber;
				data.operatetype = 'U';
			} else {
				data.operatetype = 'C';
			}
			this.$refs['contactForm'].validate(valid => {
				if (valid) {
					this.MK.Request('Publics/MemberManage/ContactPerson', 'post', data).then(res => {
						this.$message({
							message: res.msg,
							type: 'success'
						});
						this.contactModal = false;
						this.Member_contact_Get();
					});
				}
			});
		},
		// 国籍过滤
		countryFilter(key) {
			const copy = Object.assign(this.countrySelect);
			this.hospitalList = copy.filter(item => {
				// 如果直接包含输入值直接返回true
				if (item.BZNAME.indexOf(key) !== -1 || item.FILTERSTR.indexOf(key) !== -1 || item.FILTERSTR.indexOf(key.toUpperCase()) !== -1) return true;
				// toUpperCase 英文字母转换大小写
			});
		},
		// 表格列头样式
		cellStyle: function({ row, column, rowIndex, columnIndex }) {
			if (column.labelClassName == 'ChangeColor') {
				return 'color:#409EFF';
			} else {
				return '';
			}
		},
		// 更改学校
		handleChangeSchool(val) {
			this.baseInfoForm.forgname = this.schoolList.filter(item => {
				if (item.orgid == val) {
					return item;
				}
			})[0].orgname;
			console.log(this.baseInfoForm.forgname);
			this.baseInfoForm.orgid = '';
			this.classByAccount_get(val)
		},
		// 更改班级
		handleChangeClass(val) {
			this.baseInfoForm.orgname = this.classList.filter(item => {
				if (item.orgid == val) {
					return item;
				}
			})[0].orgname;;
			console.log(this.baseInfoForm.orgname)
		},
		// 更改籍贯
		handleChangeHomeCity(val) {
			this.baseInfoForm.hometownprovince = val[0];
			this.baseInfoForm.hometowncity = val[1];
			this.baseInfoForm.hometowncounty = val[2];
			console.log('籍贯', val);
		},
		// 更改出生地
		handleChangeBrithCity(val) {
			console.log('出生地', val);
			this.baseInfoForm.bornprovince = val[0];
			this.baseInfoForm.borncity = val[1];
			this.baseInfoForm.borncounty = val[2];
		},
		// 更改户口所在地
		handleChangeRegCity(val) {
			console.log('户口所在', val);
			this.baseInfoForm.regprovince = val[0];
			this.baseInfoForm.regcity = val[1];
			this.baseInfoForm.regcounty = val[2];
		},
		// 更改现居地
		handleChangeCurCity(val) {
			console.log('现居地', val);
			this.baseInfoForm.currentprovince = val[0];
			this.baseInfoForm.currentcity = val[1];
			this.baseInfoForm.currentcounty = val[2];
		},
		// 新增上传资料
		handleUploadData() {
			this.isEmpty = true;
			this.uploadDataModal = true;
			this.$refs['uploadDataForm'].resetFields();
			this.uploadDataForm = {
				idtype: '',
				idname: '',
				idnumber: '',
				note: '',
				idphoto: []
			};
			this.curImgUrl = [];
		},
		// 上传证件信息
		handleUploadIDInfo() {
			if (this.curImgUrl.length && this.curImgUrl2.length) {
				this.Member_certificate_Operate(this.switch);
			} else {
				this.$message({
					message: '请上传证件照片的正面和反面',
					type: 'warning'
				});
			}
		},
		// 根据当前账号获取学校数据
		schoolByAccount_get() {
			let arr = this.info.listhospitalinfo[0].listorgan;
			this.schoolList = arr.filter(item => {
				if (item.isdept == '0') {
					return item;
				}
			});
			if (this.schoolList.length == 1) {
				this.query.forgid = this.schoolList[0].orgid;
				this.templateInfo.schoolid = this.schoolList[0].orgid;
			}
		},
		// 根据当前账号的学校获取班级数据
		classByAccount_get(schoolid) {
			let arr = this.info.listhospitalinfo[0].listorgan.filter(item => {
				if (item.isdept == '1') {
					return item;
				}
			});
			this.classList = arr.filter(item => {
				if (item.forgid == schoolid) {
					return item;
				}
			});
		},
		// 证件一系列操作
		Member_certificate_Operate(key) {
			const url = 'Publics/MemberManage/Certificate';
			const data = {
				createid: this.info.userid,
				memberid: this.newMemberId ? this.newMemberId : this.curRowData.memberid,
				idtype: this.uploadDataForm.idtype,
				idname: this.uploadDataForm.idname,
				idnumber: this.uploadDataForm.idnumber,
				idpic: this.curImgUrl.toString().split(',')[0],
				idpic2: this.curImgUrl2.toString().split(',')[0],
				note: this.uploadDataForm.note
			};
			if (key == 'D') {
				data.operatetype = key;
			}
			if (key == 'U') {
				data.operatetype = key;
			}
			if (this.uploadDataForm.idpic == '' && this.uploadDataForm.idpic2 == '') {
				this.$message({
					message: '请上传证件照片的正面和反面',
					type: 'warning'
				});
			} else {
				this.$refs.uploadDataForm.validate(valid => {
					if (valid) {
						this.MK.Request(url, 'post', data).then(res => {
							this.$message({
								message: res.msg,
								type: 'success'
							});
							this.uploadDataModal = false;
							this.Member_certificate_Get();
							this.switch = '';
						});
					}
				});
			}
		},
		// 修改证件
		handleUploadDataEdit(val, key) {
			console.log(val);
			this.curMemberId = val.memberid;
			this.curSERIALNUMBER = val.serialnumber;
			this.uploadDataForm.idphoto = `${val.idpic},${val.idpic2}`.split(',');
			this.uploadDataForm.idname = val.idname;
			this.uploadDataForm.idtype = val.idtype.toString();
			this.uploadDataForm.idnumber = val.idnumber;
			this.uploadDataForm.note = val.note;
			if (key === 0) {
				this.uploadDataModal = true;
				this.switch = 'U';
				const url1 = val.idpic.split(',').map(item => ({
					url: item
				}));
				const url2 = val.idpic2.split(',').map(item => ({
					url: item
				}));
				this.PHTOTLIST1 = url1;
				this.PHTOTLIST2 = url2;
			}
			if (key === 1) {
				this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				})
					.then(() => {
						this.Member_certificate_Operate('D');
					})
					.catch(() => {
						this.$message({
							type: 'info',
							message: '已取消删除'
						});
					});
			}
		},
		// 会员头像
		handleMemberPhotoInput(data) {
			console.log(data, 'img');
			if (data[0]) {
				this.baseInfoForm.idphoto = data[0].url;
			} else {
				this.baseInfoForm.idphoto = '';
			}
		},
		// 打开摄像头模态框
		handleOpenCameraModal() {
			this.cameraModal = true;
		},

		// 修改上传的图片
		handleUploadInput(data) {
			this.curImgUrl = data.map(item => item.url);
			// this.uploadDataForm.idphoto = this.curImgUrl;
		},
		handleUploadInput2(data) {
			this.curImgUrl2 = data.map(item => item.url);
			// this.uploadDataForm.idphoto = this.curImgUrl;
		},
		// 联系人模态框
		handleOpenAddContactModal() {
			this.contactModal = true;
			this.$refs['contactForm'].clearValidate();
			this.contactForm.address = '';
			this.contactForm.mobiletel = '';
			this.contactForm.contactname = '';
			this.contactForm.contactship = '';
			this.curContactRow = '';
		},
		// 修改联系人
		handleContactMemberEdit(row, key) {
			console.log(row);
			this.contactForm.address = row.address;
			this.contactForm.mobiletel = row.mobiletel;
			this.contactForm.contactname = row.contactname;
			this.contactForm.contactship = row.contactship_display;
			if (key == 'D') {
				this.handleContactSubmit(row, key);
			}
			if (key == 'U') {
				this.contactModal = true;
				this.curContactRow = row;
			}
		},
		Membertype_Get() {
			this.MK.Request('Publics/MemberManage/Membertype', 'get', {
				condition: '',
				page: 1,
				rows: 10,
				tag: 1
			}).then(res => {
				this.memberTypeSelect = res.data;
				res.data.forEach(item => {
					this.memberTypeArr.push({ text: item.name, value: item.name });
				});
			});
		},
		Member_certificate_Get() {
			this.MK.Request('Publics/MemberManage/Certificate', 'get', {
				condition: this.newMemberId ? this.newMemberId : this.curRowData.memberid,
				rows: 10,
				tag: 1,
				page: 1,
				hospitalid: this.info.hospitalid
			}).then(res => {
				this.uploadTableData = res.data;
			});
		},
		Memberlevel_Get() {
			this.MK.Request('Publics/MemberManage/Memberlevel', 'get', {
				condition: '',
				page: 1,
				rows: 10,
				tag: 1
			}).then(res => {
				this.memberLevelSelect = res.data.map(item => {
					item.isCheck = false;
					return item;
				});
				this.levelName = res.data.map(item => {
					return item.name;
				});
				res.data.forEach(item => {
					this.memberLevelArr.push({ text: item.name, value: item.name });
				});
			});
		},
		MemberInfoByid_Get(memberid) {
			this.MK.Request('/Publics/MemberManage/MemberInfo', 'get', {
				createuserid: this.info.userid,
				memberid
			}).then(res => {
				var row = res.data[0];
				this.curMemberId = row.memberid;
				this.activeStep = 0;
				this.curRowData = row;
				this.memberRegisterModal = true;
				this.baseInfoForm.managerid = row.managerid;
				this.baseInfoForm.cardno = row.cardno;
				this.baseInfoForm.membername = row.membername;
				this.baseInfoForm.firstname = row.firstname;
				this.baseInfoForm.lastname = row.lastname;
				this.baseInfoForm.sex = row.sex ? row.sex.toString() : '0';
				// this.baseInfoForm.age = row.age.replace(/[^0-9]/gi, "");
				this.baseInfoForm.age = row.age;
				// 生日格式
				const backBirth = (() => {
					return `${row.birthday.slice(0, 4)}-${row.birthday.slice(4, 6)}-${row.birthday.slice(6, 8)}`;
				})();
				this.baseInfoForm.birthday = backBirth;
				this.baseInfoForm.newbaby = row.newbaby == 1 ? true : false;
				this.baseInfoForm.birthtime = row.birthtime;
				this.birthtime = this.timeFormat(row.birthtime);
				this.baseInfoForm.idtype = row.idtype ? row.idtype.toString() : '1';
				this.baseInfoForm.idnumber = row.idnumber;
				this.baseInfoForm.country = row.country ? row.country.toString() : '142';
				this.baseInfoForm.nation = row.nation ? row.nation.toString() : '1';
				this.baseInfoForm.bloodgroup = row.bloodgroup ? row.bloodgroup.toString() : '9';
				this.baseInfoForm.bloodrh = row.bloodrh ? row.bloodrh.toString() : '0';
				this.baseInfoForm.marriage = row.marriage ? row.marriage.toString() : '0';
				this.baseInfoForm.mobiletel = row.mobiletel;
				this.baseInfoForm.landline = row.landline ? row.landline : '';
				this.baseInfoForm.email = row.email ? row.email : '';
				this.baseInfoForm.postcode = row.postcode;
				this.baseInfoForm.address = row.address;
				this.baseInfoForm.language = row.language ? row.language.toString() : '0';
				this.baseInfoForm.sourceid = row.sourceid ? row.sourceid.toString() : '1';
				this.baseInfoForm.orgid = row.orgid;
				this.baseInfoForm.orgname = row.orgname;
				this.baseInfoForm.forgid = row.forgid;
				this.registerTyle == '学生' ? 
				this.classByAccount_get(row.forgid) : '';
				this.baseInfoForm.forgname = row.forgname;
				this.baseInfoForm.religion = row.religion ? row.religion.toString() : '0';
				this.baseInfoForm.memberlevel = row.memberlevel;
				this.baseInfoForm.membertype = row.membertype;
				this.baseInfoForm.headhouse = row.headhouse == '1' ? '是' : '否';
				this.baseInfoForm.profession = row.profession ? row.profession.toString() : '90';
				this.baseInfoForm.idphoto = row.idphoto;
				this.PORTRAITLIST = row.idphoto ? row.idphoto.split(',').map(item => ({ url: item })) : [];
				this.baseInfoForm.billingcode = row.billingcode ? row.billingcode : 10;
				this.baseInfoForm.cardtypeid = row.cardtypeid;
				this.baseInfoForm.balance = row.balance;
				this.baseInfoForm.memberid = row.memberid;
				this.baseInfoForm.memberintegral = row.memberintegral;
				this.baseInfoForm.sourcenote = row.sourcenote;
				// 籍贯
				const homeData = `${row.hometownprovince},${row.hometowncity},${row.hometowncounty}`;
				this.HomeCityData = homeData.split(',');
				this.baseInfoForm.hometownprovince = row.hometownprovince;
				this.baseInfoForm.hometowncity = row.hometowncity;
				this.baseInfoForm.hometowncounty = row.hometowncounty;
				// 出生地
				const bornData = `${row.bornprovince},${row.borncity},${row.borncounty}`;
				this.BrithCityData = bornData.split(',');
				this.baseInfoForm.bornprovince = row.bornprovince;
				this.baseInfoForm.borncity = row.borncity;
				this.baseInfoForm.borncounty = row.borncounty;
				// this.baseInfoForm.BORNSTREET = row.BORNSTREET;
				this.baseInfoForm.bornaddress = row.bornaddress;
				// 户口
				const regData = `${row.regprovince},${row.regcity},${row.regcounty}`;
				this.RegCityData = regData.split(',');
				this.baseInfoForm.regprovince = row.regprovince;
				this.baseInfoForm.regcity = row.regcity;
				this.baseInfoForm.regcounty = row.regcounty;
				this.baseInfoForm.regaddress = row.regaddress;
				// this.baseInfoForm.REGSTREET = row.REGSTREET;
				// 现居地
				const curCityData = `${row.currentprovince},${row.currentcity},${row.currentcounty}`;
				this.CurCityData = curCityData.split(',');
				this.baseInfoForm.currentprovince = row.currentprovince;
				this.baseInfoForm.currentcity = row.currentcity;
				this.baseInfoForm.currentcounty = row.currentcounty;
				// this.baseInfoForm.CURRENTSTREET = row.CURRENTSTREET;
				this.baseInfoForm.currentaddress = row.currentaddress;
				// 单位信息
				this.baseInfoForm.compangcode = row.compangcode;
				this.baseInfoForm.compangname = row.compangname;
				this.baseInfoForm.compangemail = row.compangemail;
				this.baseInfoForm.compangline = row.compangline;
				this.baseInfoForm.compangaddress = row.compangaddress;
				// 附加信息
				this.extraInfoForm.highesteducation = row.highesteducation ? row.highesteducation.toString() : '90';
				this.extraInfoForm.graduatedschool = row.graduatedschool;
				this.extraInfoForm.yearsalary = row.yearsalary ? row.yearsalary.toString() : '0';
				this.extraInfoForm.credits = row.credits ? row.credits.toString() : '0';
				this.extraInfoForm.allergyhistory = row.allergyhistory;
				this.extraInfoForm.pasthistory = row.pasthistory;
				this.extraInfoForm.genetichistory = row.genetichistory;
				this.extraInfoForm.travelhistory = row.travelhistory;
				this.extraInfoForm.preference = row.preference;
				this.extraInfoForm.securitylevel = row.securitylevel == 0 ? '无' : '限制';
			});
		},
		MemberInfo_Get() {
			let isPerms = this.$permission('sys:memberManagement:queryallmemberData');
			this.MK.Request('Publics/MemberManage/BasicInfo', 'get', {
				createuserid: this.info.userid,
				mycustomer: isPerms ? (this.myCustomer ? 1 : 0) : 1,
				expirationdaysmemberfee: this.pastShipFee ? 1 : 0,
				regdatebegin: '',
				regdatesend: '',
				levelidarr: [],
				flgstudent: this.registerTyle == '学生' ? 1 : 0,
				condition: this.pager.condition,
				page: this.pager.page,
				rows: this.pager.rows,
				tag: 0,
				orderby: 'createtime desc'
			}).then(res => {
				this.tableData = res.data;
				this.pager.count = res.count;
			});
		},
		Member_AccountManager_Get() {
			this.MK.Request('Publics/MemberManage/AccountManager', 'get', {
				condition: '',
				hospitalid: this.info.hospitalid,
				page: 0,
				rows: 0,
				tag: 1
			}).then(res => {
				this.customManagerList = res.data;
			});
		},
		// 家庭成员信息操作
		familyMember_Operate(key) {
			const url = 'Publics/MemberManage/FamilyMember';
			const data = {};
			data.createid = this.info.userid;
			data.memberid = 44;
			data.familymemberid = this.familyForm.familymemberid;
			data.membership = this.familyForm.membership;
			data.operatetype = key || 'C';
			// 编辑
			// if (this.curMemberId) {
			//   const shipcode = this.membershipid.map(item => {
			//     if (item.bzname == this.familyForm.membership) {
			//       return item.bzcode;
			//     }
			//   });
			//   data.membership = shipcode[0];
			// }
			this.MK.Request(url, 'post', data).then(res => {
				this.$message({
					message: res.msg,
					type: 'success'
				});
				this.openAddFamilyModal = false;
				this.Member_family_Get();
			});
		},
		Member_family_Get() {
			this.MK.Request('Publics/MemberManage/FamilyMember', 'get', {
				condition: this.curRowData.memberid,
				rows: 10,
				page: 1,
				tag: 1,
				hospitalid: this.info.hospitalid
			}).then(res => {
				this.familyTableData = res.data;
			});
		},
		Member_contact_Get() {
			this.MK.Request('Publics/MemberManage/ContactPerson', 'get', {
				memberid: this.curRowData.memberid || this.newMemberId,
				condition: '',
				rows: 10,
				page: 1,
				tag: 1,
				hospitalid: this.info.hospitalid
			}).then(res => {
				this.memberContactTableData = res.data;
			});
		},
		MemberBilling_Get() {
			this.MK.Request('Publics/Common/Dic/MemberBilling', 'get', {
				condition: '',
				page: 1,
				rows: 999,
				tag: 0
			}).then(res => {
				this.memberBillingList = res.data;
			});
		},
		CardType_Get() {
			this.MK.Request('Publics/Common/Dic/CardType', 'get', {
				condition: '',
				page: 1,
				rows: 999,
				tag: 0
			}).then(res => {
				this.cardTypeList = res.data;
			});
		},
		events_Get() {
			this.MK.Request('/Publics/Common/Dic/HospitalEvents', 'get').then(res => {
				this.HospitalEvents = res.data;
			});
		},
		// 获取当前日期
		getCurDate() {
			const year = new Date().getFullYear();
			const month = new Date().getMonth() + 1 < 10 ? '0' + (new Date().getMonth() + 1) : new Date().getMonth() + 1;
			const day = new Date().getDate() < 10 ? '0' + new Date().getDate() : new Date().getDate();
			return `${year}${month}${day}`;
		},
		// 日期格式化 传入值如 20200503
		dateFormat(date) {
			if (date) {
				var year = date.substr(0, 4);
				var month = date.substr(4, 2);
				var day = date.substr(6);
				return `${year}-${month}-${day}`;
			}
		},
		// 通过日期计算年龄
		ageComputed(date) {
			var myDate = new Date();
			var month = myDate.getMonth() + 1;
			var day = myDate.getDate();
			var age = myDate.getFullYear() - date.substring(0, 4) - 1;
			if (date.substring(4, 6) < month || (date.substring(4, 6) == month && date.substring(6) <= day)) {
				age++;
			}
			return age;
		},
		// 时间格式化
		timeFormat(time) {
			if (time != null && time != undefined && time != '' && time != '::') {
				var hour = time.substring(0, 2);
				var min = time.substring(2, 4);
				var sec = time.substring(4);
				console.log(time, hour, min, sec);
				return `${hour}:${min}:${sec}`;
			} else {
				return '';
			}
		}
	},
	watch: {
		userData: {
			deep: true,
			handler(val) {
				this.curRowData = val;
			}
		},
		memberRegisterModal(val) {
			if (!val) {
				this.$emit('update:userdata', {});
				this.sourceCode = 1;
			}
		},
		isNewMember() {
			if (!this.memberRegisterModal) return false;
		},
		uploadDataModal(val) {
			if (!val && this.curMemberId) {
				this.isEmpty = false;
			}
		},
		memberRegisterModal(val) {
			if (!val && this.curRowData.memberid) {
				this.isPortraitEmpty = false;
			}
		},
		contactModal(val) {
			if (!val) {
				this.curContactRow = '';
			}
		},
		'curRowData.sourceid'(val) {
			if (val == 0) {
				this.sourceCode = 1;
				this.sourcenoteLabel = '慕名备注';
			}
			if (val == 2) {
				this.sourceCode = 2;
				this.sourcenoteLabel = '介绍人姓名';
			}
			if (val == 3) {
				this.sourceCode = 3;
				this.sourcenoteLabel = '活动类型';
			}
			if (val == 4) {
				this.sourceCode = 4;
				this.sourcenoteLabel = '单位名称';
			}
			if (val == 5) {
				this.sourceCode = 5;
				this.sourcenoteLabel = '保险名称';
			}
		},
		registerTyle(val) {
			if (val == '学生') {
				this.baseInfoForm.idtype = 1;
			} else {
				this.baseInfoForm.idtype = '';
			}
		}
	}
};
</script>

<style scoped>
>>> .el-date-editor .el-range-separator {
	width: 8%;
}
>>> .el-select-dropdown__item span {
	width: 20px;
	height: 20px;
	border: 1px solid red;
}
.mr20 {
	margin-right: 20px !important;
}
.base-info-form {
	width: 1220px;
	height: 700px;
	/* border: 1px solid #dcdfe6; */
	margin: 10px auto 0;
	padding: 10px 10px 0 10px;
	border-radius: 8px;
	position: relative;
}
.inputLong {
	width: 670px;
}
.inputMid {
	width: 540px;
}
.inputShort {
	width: 280px;
}
.underLine {
	text-decoration: underline;
	color: #409eff;
	font-weight: bold;
	cursor: pointer;
}
.biaoqian {
	display: flex;
	flex-direction: column;
	margin-left: 20px;
}
.biaoqian > i {
	font-size: 30px !important;
	cursor: pointer;
}
.footer {
	display: flex;
	flex-direction: column;
	align-items: center;
}
</style>

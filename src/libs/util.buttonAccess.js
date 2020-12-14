// import mkRequest from "@api/sys.request.js";

export function buttonAccess(){
    var access = document.getElementsByClassName("btn");
    console.log("access",access);
    var ids = [];
    var names = [];
    for(let i=0;i<access.length;i++){
      ids.push(access[i].id);
      names.push(access[i].innerText);
    }
    // this.access.id = ids;
    // this.access.name = names;
    menuid = this.menuData.menuid;
    console.log("id",ids);
    console.log("name",names);
    // console.log("access",this.access);
    // this.MK.Request("Access_Add", "post", {id:ids,name:names,menuid:menuid}, {
    //     app: "531d822cd2ec4c959ca16104184a4dc9",
    //     mod: "qxgl"
    //   }).then(res => {
    //   if (res.code == 0) {
    //         this.$message({
    //           type: "success",
    //           message: res.msg
    //         });
    //       }
    // });
  }

 
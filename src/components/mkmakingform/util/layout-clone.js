import _ from 'lodash'
import { MD5 } from "@/libs/util.md5.js";
export const CloneLayout = (data) => {
  if (data.type === 'grid') {
    let key = new Date().getTime() + Math.random().toString(36).slice(-8)
    return {
      ...data,
      key:key.MD5().toUpperCase(),
      model: key.MD5().toUpperCase(),
      columns: data.columns.map (item => {
        return {
          ...item,
          list: item.list.map(colItem => {
            return CloneLayout(colItem)
          })
        }
      })
    }
  }else if(data.type === 'rowmatrix'){
    let key = new Date().getTime() + Math.random().toString(36).slice(-8)
    let keys = new Date().getTime() + Math.random().toString(36).slice(-8)
    return {
      ...data,
      key:key.MD5().toUpperCase(),
      model: key.MD5().toUpperCase(),
      columns: data.columns.map ((item,index )=> {
        return {
          ...item,
          list: item.list.map(colItem => {
            return {
              ...CloneLayout(colItem),
              key:index > 0 ? keys.MD5().toUpperCase() + '_' + index : keys.MD5().toUpperCase(),
              model:index > 0 ? keys.MD5().toUpperCase() + '_' + index : keys.MD5().toUpperCase()
            }
          })
        }
      })
    }
  } else if (data.type === 'tabs') {
    let key = new Date().getTime() + Math.random().toString(36).slice(-8)
    return {
      ...data,
      key:key.MD5().toUpperCase(),
      model: key.MD5().toUpperCase(),
      tabs: data.tabs.map (item => {
        return {
          ...item,
          list: item.list.map (tabItem => {
            return CloneLayout(tabItem)
          })
        }
      })
    }
  } else if (data.type === 'table') {
    let key = new Date().getTime() + Math.random().toString(36).slice(-8)
    return {
      ...data,
      key:key.MD5().toUpperCase(),
      model: key.MD5().toUpperCase(),
      tableColumns: data.tableColumns.map (item => {
        return CloneLayout(item)
      })
    }
  } else {
    let key = new Date().getTime() + Math.random().toString(36).slice(-8)
    return {
      ...data,
      key:key.MD5().toUpperCase(),
      model: key.MD5().toUpperCase(),
    }
  }
}
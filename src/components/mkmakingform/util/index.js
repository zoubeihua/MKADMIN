export const loadJs = (url) => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = url
    script.type = 'text/javascript'
    document.body.appendChild(script)
    script.onload = () => {
      const language_tools = document.createElement('script')
      language_tools.src = '/lib/ace/ext-language_tools.js'
      language_tools.type = 'text/javascript'
      document.body.appendChild(language_tools)
      language_tools.onload = () => {
        const sql_formatter = document.createElement('script')
        sql_formatter.src = '/lib/sqlFormatter/sql-formatter.min.js'
        sql_formatter.type = 'text/javascript'
        document.body.appendChild(sql_formatter)
        resolve()
      }
    }
  })
}

export const loadCss = (url) => {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = url
    document.head.appendChild(link)
    link.onload = () => {
      resolve()
    }
  })
}

export const generateUUID = () => {
  var d = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (d + Math.random()*16)%16 | 0;
      d = Math.floor(d/16);
      return (c=='x' ? r : (r&0x7|0x8)).toString(16);
  });
  return uuid;
}

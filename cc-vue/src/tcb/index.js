import cloudbase from '@cloudbase/js-sdk'

const tcb = cloudbase.init({
    env: import.meta.env.VITE_TCB_ENVID,
    region: import.meta.env.VITE_TCB_REGION
})

const auth = tcb.auth()

export { tcb, auth }
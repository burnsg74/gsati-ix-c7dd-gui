const url = new URL(window.location.href)
const authenticateURL = 'https://c30qsbdrce.execute-api.us-west-2.amazonaws.com'
const getSettingsURL = 'https://rhbxbd3ui7.execute-api.us-west-2.amazonaws.com'
const getDdDataFieldsURL = 'https://qz27mqkt98.execute-api.us-west-2.amazonaws.com'
const putSettingsURL = 'https://4lw0oatpgd.execute-api.us-west-2.amazonaws.com'
const putMappingURL = 'https://fpena5jjce.execute-api.us-west-2.amazonaws.com'
const getMappingURL = 'https://lhb06c7hf5.execute-api.us-west-2.amazonaws.com'
const postContactLoadURL = 'https://5vfahl4tu0.execute-api.us-west-2.amazonaws.com/dev'
const postProductLoadURL = 'https://n4zyj4acn1.execute-api.us-west-2.amazonaws.com/dev'
const postOrderLoadURL = 'https://w8nvt40nwl.execute-api.us-west-2.amazonaws.com/dev'
const getQueueStatusURL = 'https://wey791l4rg.execute-api.us-west-2.amazonaws.com'

let tenantId = null
let token = null
let pathname = window.location.pathname
let parts = window.location.pathname.split('/')
let page = getLastItem(parts)
let settings = null

if (pathname !== '/401.html' || pathname !== '/error.html') {
    authUserGuard()
}

findLink(page)
getSettings()

function findLink(page) {
    console.log('findLink')
    const links = document.getElementsByTagName('a')
    for (let i = 0; i < links.length; i++) {
        if (links[i].href.indexOf(page) > -1) {
            links[i].className += ' active'
        }
    }
}

function getLastItem(urlArray) {
    return urlArray[urlArray.length - 1]
}

function authUserGuard() {

    const url = new URL(window.location.href)

    handleTenantId()
    handleToken()
    authenticateTenant()

    function handleTenantId() {
        console.log('handleTenantId')

        if (url.searchParams.has('tenantId') === false) {
            if (sessionStorage.hasOwnProperty('tenantId')) {
                tenantId = sessionStorage.getItem('tenantId')
                return
            }

            console.log('ERROR missing tenantId')
            window.location.replace('401.html')
            return
        }

        tenantId = url.searchParams.get('tenantId')

        console.log('tenantId: ' + tenantId)
        sessionStorage.setItem('tenantId', tenantId)
    }

    function handleToken() {
        console.log('handleToken')

        if (url.searchParams.has('account') === false) {
            if (sessionStorage.hasOwnProperty('token')) {
                token = sessionStorage.getItem('token')
                return
            }

            console.log('ERROR missing token')
            window.location.replace('401.html')
            return
        }

        token = url.searchParams.get('account')
        console.log('token: ' + token)

        sessionStorage.setItem('token', token)
    }

    function authenticateTenant() {
        console.log('authenticateTenant URL: ' + authenticateURL)

        axios.post(authenticateURL, {tenantId, token}).then(function (response) {
            console.log('Authenticated', response, response.data)
            console.log(response.data.status)
            if (response.data.status === 'invalidDotdigitalCredentials') {
                console.log('Invalid Dotdigital Credentials')
                const invalidDotdigitalCreds = document.getElementById('invalidDotdigitalCreds')
                invalidDotdigitalCreds.style.display = 'block'
            }
        }).catch(function (error) {
            console.log('Auth Error', error)
            window.location.replace('401.html')
        })
    }
}

function getSettings() {
    // does settings exist in session storage?
    if (sessionStorage.hasOwnProperty('settings')) {
        settings = JSON.parse(sessionStorage.getItem('settings'))
        console.log('settings from session storage')
    } else {
        axios.post(getSettingsURL, {tenantId, token}).then(function (response) {
            settings = response.data
            sessionStorage.setItem('settings', JSON.stringify(settings))
        }).catch(function (error) {
            // console.log(error)
            window.location.replace('401.html')
        })
    }
}
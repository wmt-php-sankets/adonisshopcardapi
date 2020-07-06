'use strict'

const User = use('App/Models/User')

class AuthController {

    async redirectToProvider ({ally, params}) {
        console.log(await ally.driver(params.provider));
        await ally.driver(params.provider).redirect()
    }

    async handleProviderCallback ({params, ally, auth, response}) {
        const provider = params.provider
        try {
            console.log('run1');
            const userData = await ally.driver(params.provider).getUser()

            const authUser = await User.query().where({
                'provider': provider,
                'provider_id': userData.getId()
            }).first()
            if (!(authUser === null)) {
                await auth.loginViaId(authUser.id)
                return response.redirect('/')
            }

            const user = new User()
            
            user.username = userData.getNickname()

            await user.save()

            await auth.loginViaId(user.id)
            return response.redirect('/')
        } catch (e) {
            console.log(e)
            response.redirect('/auth/' + provider)
        }
    }

    async logout ({auth, response}) {
        await auth.logout()
        response.redirect('/')
    }
}
module.exports = AuthController

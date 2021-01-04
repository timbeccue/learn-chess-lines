<template>
    <section>
    <b-navbar 
        type="is-light"
        >
        <template slot="brand">
            <b-navbar-item>
                <img
                    src="https://raw.githubusercontent.com/buefy/buefy/dev/static/img/buefy-logo.png"
                    alt="Lightweight UI components for Vue.js based on Bulma"
                >
            </b-navbar-item>
        </template>
        <template slot="start">
            <b-navbar-item href="/">
                Home
            </b-navbar-item>
            <b-navbar-item href="/about">
                About
            </b-navbar-item>
        </template>

        <template slot="end">
            <b-navbar-item tag="div">
                <div v-if="!isLoggedIn" class="buttons">
                    <a 
                        @click="isSignupModalActive = true"
                        class="button is-primary">
                        <strong>Sign up</strong>
                    </a>
                    <a 
                        @click="isLoginModalActive = true" 
                        class="button is-light">
                        Log in
                    </a>
                </div>
                <div v-else class="buttons">
                    <b-navbar-dropdown>
                        <template slot="label">Hello, {{userProfile.name}}</template>
                        <b-navbar-item href="/profile">
                            Profile
                        </b-navbar-item>
                        <b-navbar-item @click="logout">
                            Log Out
                        </b-navbar-item>
                    </b-navbar-dropdown>
                </div>
            </b-navbar-item>
        </template>
    </b-navbar>

    <b-modal 
        v-model="isLoginModalActive"
        has-modal-card
        trap-focus
        :destroy-on-hide="false"
        aria-role="dialog"
        aria-modal>
        <template #default="props">
            <login-modal v-bind="formProps" @close="props.close"></login-modal>
        </template>
    </b-modal>

    <b-modal 
        v-model="isSignupModalActive"
        has-modal-card
        trap-focus
        :destroy-on-hide="false"
        aria-role="dialog"
        aria-modal>
        <template #default="props">
            <signup-modal @close="props.close"></signup-modal>
        </template>
    </b-modal>
    </section>
</template>

<script>
import {mapState} from 'vuex'
import LoginModal from '@/components/LoginModal'
import SignupModal from '@/components/SignupModal'
export default {
    name: "Navbar",    
    components: {
        LoginModal,
        SignupModal,
    },
    data() {
        return {
            isLoginModalActive: false,
            isSignupModalActive: false,
            formProps: {
                email: '',
                password: '',
            },
                
        }
    },
    methods: {
        logout() {
            this.$store.dispatch('auth/logout')
        },
    },
    computed: {
        ...mapState('auth', [
            'userProfile',
            'isLoggedIn',
        ])
    }
}
</script>

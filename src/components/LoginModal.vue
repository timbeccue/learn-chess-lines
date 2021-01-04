<template>
    <section>
        <form @submit.prevent action="">
            <div class="modal-card" style="width: auto">
                <header class="modal-card-head">
                    <p class="modal-card-title">Login</p>
                    <button
                        type="button"
                        class="delete"
                        @click="$emit('close')"/>
                </header>
                <section class="modal-card-body">
                    <b-field label="Email">
                        <b-input
                            type="email"
                            :value="email"
                            v-model="email"
                            placeholder="Your email"
                            required>
                        </b-input>
                    </b-field>

                    <b-field label="Password">
                        <b-input
                            type="password"
                            :value="password"
                            v-model="password"
                            password-reveal
                            placeholder="Your password"
                            required>
                        </b-input>
                    </b-field>

                    <b-checkbox>Remember me</b-checkbox>
                </section>
                <footer class="modal-card-foot">
                    <button class="button" type="button" @click="$emit('close')">Close</button>
                    <button class="button is-primary" @click="login">Login</button>
                </footer>
            </div>
        </form>
    </section> 
</template>

<script>
import {mapState} from 'vuex'
export default {
    name: "LoginModal",
    props: ['canCancel'],
    data() {
        return {
            email: '',
            password: '',
        }
    },
    methods: {
        login() {
            this.$store.dispatch('auth/login', {
                email: this.email,
                password: this.password,
            })
        }
    },
    computed: {
        ...mapState('auth', [
            'userProfile'
        ])
    }
}
</script>
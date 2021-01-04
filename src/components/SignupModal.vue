<template>
    <section>
        <form @submit.prevent action="">
            <div class="modal-card" style="width: auto">
                <header class="modal-card-head">
                    <p class="modal-card-title">Sign Up</p>
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

                </section>
                <footer class="modal-card-foot">
                    <button class="button" type="button">Close</button>
                    <button class="button is-primary" @click="signup">Sign Up</button>
                </footer>
            </div>
        </form>
    </section> 
</template>

<script>

export default {
    name: "SignupModal",
    data() {
        return {
            email: '',
            password: '',
        }
    },
    methods: {

        signup() {
            console.log('in submit')
            this.$store.dispatch('auth/signup', {
                email: this.email,
                password: this.password,
                name: 'tim',
            })
        },
    }
}
</script>
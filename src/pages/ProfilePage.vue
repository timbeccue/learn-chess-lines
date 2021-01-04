<template>
    <div>
        <p>profile page</p>
        user profile: {{$store.state.auth.userProfile}}
    </div>
</template>

<script>
export default {
    name: "ProfilePage" 
}
</script>
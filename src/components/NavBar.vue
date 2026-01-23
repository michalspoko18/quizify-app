<template>
  <nav class="navbar navbar-expand-lg border-bottom">
    <div class="container">
      <a class="navbar-brand" href="#" @click.prevent="$router.push('/')"
        >Quizify App</a
      >
      <div class="ms-auto d-flex align-items-center gap-2">
        <span v-if="store.isAuth" class="text-secondary small">
          <template v-if="store.nick"
            ><span class="badge text-bg-warning me-2">{{
              store.nick
            }}</span></template
          >
          {{ store.username }}
        </span>
        <button
          v-if="store.isAuth"
          class="btn btn-warning btn-sm"
          @click="$emit('open-nick')"
        >
          Nick
        </button>
        <button
          v-if="store.isAuth"
          class="btn btn-outline-secondary btn-sm"
          @click="$emit('logout')"
        >
          Wyloguj
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup>
defineProps({ store: { type: Object, required: true } });
</script>

<template>
    <main>
        <h2>Create A Lesson</h2>
        <CreateLessonForm />
    </main>
</template>

<script>
import CreateLessonForm from '@/components/lesson/CreateLessonForm.vue'

export default {
    name: "CreateLessonPage",
    components: { CreateLessonForm },
};
</script>
<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { IndexCollectionItem } from '@nuxt/content'

defineProps<{
  page: IndexCollectionItem
}>()

const { data: projects } = await useAsyncData('projects', () => {
  return queryCollection('projects').all()
})

const isImageModalOpen = ref(false)
const selectedProjectImage = ref<{
  src: string
  alt: string
} | null>(null)

const uniqueTechStack = computed(() => {
  const items: Array<{
    key: string
    icon?: string
    logo?: string
    label?: string
    color?: string
  }> = []
  const seen = new Set<string>()

  for (const project of projects.value ?? []) {
    for (const tech of project?.techStack ?? []) {
      if (!tech) {
        continue
      }
      const key = tech.icon || tech.logo || tech.label
      if (!key || seen.has(key)) {
        continue
      }
      seen.add(key)
      items.push({ key, ...tech })
    }
  }

  return items
})

const formatProjectPeriod = (project: any) => {
  try {
    if (project?.startDate) {
      const startYear = new Date(project.startDate).getFullYear()
      const endYear = project.endDate ? new Date(project.endDate).getFullYear() : 'Present'
      return `${startYear}–${endYear}`
    }
    if (project?.date) {
      return String(new Date(project.date).getFullYear())
    }
  } catch {}
  return ''
}

const isGif = (src?: string | null): boolean => typeof src === 'string' && src.toLowerCase().endsWith('.gif')
const isPdf = (src?: string | null): boolean => typeof src === 'string' && src.toLowerCase().endsWith('.pdf')

const showProjectImage = (project: any) => {
  if (!project?.image || isPdf(project.image)) {
    return
  }
  selectedProjectImage.value = {
    src: project.image,
    alt: project.title ?? 'Project image'
  }
  isImageModalOpen.value = true
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    isImageModalOpen.value = false
  }
}

onMounted(() => {
  if (process.client) {
    window.addEventListener('keydown', handleKeydown)
  }
})

onBeforeUnmount(() => {
  if (process.client) {
    window.removeEventListener('keydown', handleKeydown)
  }
})

watch(isImageModalOpen, (isOpen) => {
  if (!isOpen) {
    selectedProjectImage.value = null
  }
})
</script>

<template>
  <UPageSection
    :title="page.projects.title"
    :ui="{
      container: 'px-0 !pt-0 sm:gap-6 lg:gap-8',
      wrapper: 'mb-4',
      title: 'text-center text-xl sm:text-xl lg:text-2xl font-medium',
      description: 'text-center mt-2 text-pretty max-w-none text-sm sm:text-md lg:text-sm text-muted'
    }"
  >
    <template #description>
      <div
        v-if="uniqueTechStack.length"
        class="mt-2 flex flex-wrap items-center justify-center gap-2"
      >
        <span
          v-for="tech in uniqueTechStack"
          :key="tech.key"
          class="inline-flex items-center gap-2 rounded-full bg-muted px-2.5 py-1 text-xs font-medium"
        >
          <UIcon
            v-if="tech.icon"
            :name="tech.icon"
            class="h-4 w-4"
            aria-hidden="true"
            :style="tech.color ? { color: tech.color } : undefined"
          />
          <NuxtImg
            v-else-if="tech.logo"
            :src="tech.logo"
            width="16"
            height="16"
            class="h-4 w-4 object-contain"
            alt=""
            aria-hidden="true"
          />
          <span class="text-muted">
            {{ tech.label ?? tech.key }}
          </span>
        </span>
      </div>
      <MDC
        v-else
        :value="page.projects.description"
        unwrap="p"
      />
    </template>
  <UPageSection
      :ui="{
        container: '!pt-0'
      }"
    >
      <Motion
        v-for="(project, index) in projects"
        :key="project.title"
        :initial="{ opacity: 0, transform: 'translateY(10px)' }"
        :while-in-view="{ opacity: 1, transform: 'translateY(0)' }"
        :transition="{ delay: 0.2 * index }"
        :in-view-options="{ once: true }"
        >
          <UPageCard
            :title="project.title"
            orientation="horizontal"
            variant="naked"
            :reverse="index % 2 === 1"
            class="group"
            :ui="{
              wrapper: 'max-sm:order-last'
            }"
          >
            <template #description>
              <MDC :value="project.description" unwrap="p" />
            </template>
            <template #leading>
              <span class="text-sm text-muted">
                {{ formatProjectPeriod(project) }}
              </span>
            </template>
          <template #footer>
            <div class="flex flex-col gap-3">
              <div
                v-if="project?.techStack?.length"
                class="flex flex-wrap items-center gap-2"
              >
                <span
                  v-for="tech in project.techStack"
                  :key="tech.label"
                  class="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs font-medium"
                >
                  <UIcon
                    v-if="tech.icon"
                    :name="tech.icon"
                    class="h-4 w-4"
                    aria-hidden="true"
                    :style="tech.color ? { color: tech.color } : undefined"
                  />
                  <NuxtImg
                    v-else-if="tech.logo"
                    :src="tech.logo"
                    width="16"
                    height="16"
                    class="h-4 w-4 object-contain"
                    alt=""
                    aria-hidden="true"
                  />
                  <span class="text-muted">
                    {{ tech.label }}
                  </span>
                </span>
              </div>
              <ULink
                :to="project.url"
                class="text-sm text-primary flex items-center"
              >
                View Project
                <UIcon
                  name="i-lucide-arrow-right"
                  class="size-4 text-primary transition-all opacity-0 group-hover:translate-x-1 group-hover:opacity-100"
                />
              </ULink>
            </div>
          </template>
          <div
            v-if="project.video"
            class="w-full h-60 sm:h-64 lg:h-72 bg-default rounded-lg overflow-hidden flex items-center justify-center"
          >
            <video
              :src="project.video"
              controls
              loop
              muted
              playsinline
              class="h-full w-full object-contain"
            ></video>
          </div>
          <div
            v-else-if="project.image && isPdf(project.image)"
            class="w-full h-60 sm:h-64 lg:h-72 bg-default rounded-lg overflow-hidden flex items-center justify-center"
          >
            <object
              :data="project.image"
              type="application/pdf"
              class="h-full w-full"
            >
              <div class="flex h-full w-full flex-col items-center justify-center gap-2 p-4 text-center text-muted text-sm">
                <span>PDF preview unavailable.</span>
                <ULink
                  :to="project.image"
                  target="_blank"
                  class="text-primary underline underline-offset-2"
                >
                  Open PDF
                </ULink>
              </div>
            </object>
          </div>
          <button
            v-else-if="project.image && !isPdf(project.image)"
            type="button"
            class="w-full h-60 sm:h-64 lg:h-72 bg-default rounded-lg overflow-hidden flex items-center justify-center transition hover:ring-2 hover:ring-primary focus-visible:ring-2 focus-visible:ring-primary"
            :aria-label="`View larger image of ${project.title}`"
            @click="showProjectImage(project)"
          >
            <NuxtImg
              :src="project.image"
              :alt="project.title"
              class="max-w-full max-h-full object-contain transition duration-300 hover:scale-105"
              :format="isGif(project.image) ? undefined : 'webp'"
              sizes="sm:100vw md:800px lg:1000px"
              :placeholder="25"
            />
          </button>
          <div
            v-else
            class="w-full h-60 sm:h-64 lg:h-72 bg-default rounded-lg overflow-hidden flex items-center justify-center text-muted text-sm"
          >
            Preview coming soon
          </div>
        </UPageCard>
      </Motion>
    </UPageSection>
  </UPageSection>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="isImageModalOpen && selectedProjectImage"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6 backdrop-blur"
        role="dialog"
        :aria-label="`Larger preview of ${selectedProjectImage.alt}`"
        aria-modal="true"
        @click.self="isImageModalOpen = false"
      >
        <div class="relative max-h-[85vh] w-full max-w-4xl">
          <UButton
            icon="i-lucide-x"
            color="neutral"
            variant="ghost"
            class="absolute right-2 top-2 z-10 size-8"
            aria-label="Close image preview"
            @click="isImageModalOpen = false"
          />
          <NuxtImg
            :src="selectedProjectImage.src"
            :alt="selectedProjectImage.alt"
            class="max-h-[85vh] w-full rounded-lg object-contain"
            :format="isGif(selectedProjectImage.src) ? undefined : 'webp'"
            sizes="sm:100vw md:1200px"
          />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

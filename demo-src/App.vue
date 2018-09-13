<template>
  <div id="app">
    <header>
      <h1>Material Icons <small>for <a href="https://github.com/Justineo/vue-awesome">Vue-Awesome</a></small></h1>
    </header>
    <section class="filter">
      <div class="query">
        <label class="search-box">
          <input required type="text" autocomplete="off" class="search" v-model="query">
          <span class="placeholder">Type to search...</span>
          <span class="line"></span>
        </label>
      </div>
      <div class="themes">
        <label v-for="t of themes" :key="t">
          <input type="radio" name="theme" :value="t" v-model="theme">
          <span class="theme-text">{{ t.replace(/_/g, '-') }}</span>
        </label>
      </div>
    </section>
    <section class="info">{{ filteredNames.length || 'No' }} icon{{ filteredNames.length > 1 ? 's' : '' }} found.</section>
    <ul class="items" name="item">
      <li class="item" v-for="name of filteredNames" :key="name" @click="select">
        <figure>
          <v-icon :name="name"/>
          <figcaption>{{ name }}</figcaption>
        </figure>
      </li>
    </ul>
  </div>
</template>

<script>
import Icon from 'vue-awesome/components/Icon'
import '../icons'

const THEMES = ['filled', 'outlined', 'rounded', 'two_tone', 'sharp']
const RE_THEMED = new RegExp(`_(?:${THEMES.slice(1).join('|')})$`)

export default {
  name: 'app',
  components: {
    'v-icon': Icon
  },
  data () {
    return {
      query: '',
      names: Object.keys(Icon.icons),
      theme: THEMES[0],
      themes: THEMES
    }
  },
  computed: {
    filteredNames () {
      return this.themedNames.filter(name => name.includes(this.query.trim()))
    },
    themedNames () {
      return this[this.theme]
    },
    filled () {
      return this.names.filter(name => !name.match(RE_THEMED))
    },
    outlined () {
      return this.names.filter(name => name.endsWith('_outlined'))
    },
    rounded () {
      return this.names.filter(name => name.endsWith('_rounded'))
    },
    two_tone () {
      return this.names.filter(name => name.endsWith('_two_tone'))
    },
    sharp () {
      return this.names.filter(name => name.endsWith('_sharp'))
    }
  },
  methods: {
    select ({ target }) {
      const range = document.createRange()
      range.selectNodeContents(target.querySelector('figcaption'))
      const selection = window.getSelection()
      selection.removeAllRanges()
      selection.addRange(range)
    }
  }
}
</script>

<style>
*,
*::before,
*::after {
  box-sizing: border-box;
}

#app {
  font-family: Roboto, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: rgba(0,0,0,.87);
}

a {
  color: rgba(0,0,0,.87);
  text-decoration: none;
  transition: all .4s;
  border-bottom: 2px dotted transparent;
}

a:hover {
  border-bottom-color: currentColor;
}

body {
  margin: 0;
}

header {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 25.2vh;
  min-height: 192px;
}

h1 {
  margin: 0;
  font-weight: 400;
}

.filter {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 13vh;
  min-height: 72px;
  position: relative;
  top: -1.5em;
  margin: 0;
}

.info {
  margin: 2em;
  opacity: .5;
}

.search-box {
  position: relative;
  display: inline-block;
  cursor: pointer;
}

.placeholder {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
  opacity: .5;
  transition: all .4s;
}

.search {
  height: 3em;
  font: inherit;
  border: none;
  border-bottom: 2px solid #ccc;
  outline: none;
  text-align: center;
  transition: all .4s;
}

.search:hover {
  border-color: #999;
}

.line {
  position: absolute;
  width: 100%;
  height: 2px;
  bottom: 0;
  left: 0;
  background-color: rgba(0,0,0,.87);
  transform-origin: 50% 50%;
  transform: scaleX(0);
  transition: all .4s;
}

.search:valid + .placeholder,
.search:focus + .placeholder {
  transform: translateY(-2em) scale(.8);
}

.search:focus ~ .line {
  transform: scaleX(1);
}

.themes {
  margin-top: 2em;
  font-size: 12px;
  text-transform: capitalize;
}

.themes input {
  position: absolute;
  opacity: 0;
}

.theme-text {
  display: inline-block;
  margin: 0 1em;
  padding: .5em .8em;
  cursor: pointer;
  transition: all .4s;
}

.theme-text:hover {
  background-color: #eee;
}

:checked + .theme-text {
  background-color: rgba(0,0,0,.87);
  color: #fff;
}

small {
  opacity: .3;
}

.items {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  margin: 0;
  padding: 0;
  list-style-type: none;
}

@media (max-width: 575.98px) {
  h1 > small {
    display: block;
    font-size: .7em;
  }

  .filter {
    margin: 1em 0;
  }

  .theme-text {
    margin: 0 .5em;
  }
}

@media (min-width: 576px) {
  .items {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (min-width: 768px) {
  .items {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

@media (min-width: 992px) {
  .items {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }
}

@media (min-width: 1200px) {
  .items {
    grid-template-columns: repeat(6, minmax(0, 1fr));
  }
}

.item {
  margin: .5em;
  padding: 1em .5em;
  border-radius: 2px;
  border: 2px solid transparent;
  transition: all .4s;
  cursor: pointer;
}

.item:hover {
  border-color: rgba(0,0,0,.87);
  transform: scale(1.1)
}

.fa-icon {
  width: auto;
  height: 1em;
  max-width: 100%;
  max-height: 100%;
  font-size: 32px;
}

figure {
  margin: 0;
}

figcaption {
  margin-top: 0.5em;
  font-size: 12px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

::selection {
  color: #fff;
  background-color: rgba(0,0,0,.87);
}
</style>

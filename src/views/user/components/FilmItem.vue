<template>
  <div class="filmItem">
    <img :src="item.image" class="image" @click="toShowFilmDetail(item.id)">
    <div class="buyBtn" @click="toBuyFilm(item.id)">购票</div>
  </div>
</template>
<script>
export default {
  props: {
    item: {
      type: Object,
      default: () => { }
    }
  },
  name: "",
  data() {
    return {};
  },
  methods: {
    toBuyFilm(filmId) {
      this.$router.push({
        name: "buy",
        params: {
          filmId,
        },
      });
    },
    toShowFilmDetail(filmId) {
      this.$router.push({
        name: "showDetail",
        params: {
          filmId,
        },
      });
    },

  },
};
</script>
<style lang="scss" scoped>
.filmItem {
  display: flex;
  flex-direction: column;
  // height: 280px;
  &:hover {
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.3);
    cursor: pointer;
    transform: scale(1.1);
  }

  .image {
    width: 100%;
    height: 250px;
    display: block;
  }

  .buyBtn {
    width: 100%;
    height: 40px;
    color: red;
    background-color: #fff;
    border: 1px solid #e7e7e7;
    border-top: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    &:hover {
      background-color: red;
      color: white;
    }
  }
}
</style>

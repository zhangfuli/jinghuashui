<template>
  <div id="app">
    <img src="../images/xiaomifeng-logo.jpg" alt="" width="300px" class="logo">
    <Menu mode="horizontal" theme="light" active-name="1">
      <router-link id="user"
                   to="/user">
        <MenuItem name="1">
          <Icon type="ios-people"/>
          用户管理
        </MenuItem>
      </router-link>

      <router-link id="order"
                   to="/order">
        <MenuItem name="2">
          <Icon type="ios-paper"/>
          订单管理
        </MenuItem>
      </router-link>

    </Menu>
    <br>
    <br>
    <router-view/>
  </div>
</template>

<script>
  export default {
    name: 'App'
  }
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    width: 90%;
    margin: 40px auto 0;
  }
  .logo{
    display: block;
  }
</style>

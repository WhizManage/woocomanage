<?php

/**
 * plugin Name: Woocomanage
 * Description: Easily manage a WooCommerce store
 * Author: Woocomanage 
 * Author URI: https://woocomanage.com/
 * Version: 0.0.7
 * Text Domain:  woocomanage-text
 * Requires at least: 6.4
 * Requires PHP: 5.3
 */


if (!defined("ABSPATH")) {
    exit;
}


//Checking if there is a WooCommerce plugin
$plugin_path = trailingslashit(WP_PLUGIN_DIR) . 'woocommerce/woocommerce.php';
if (!(in_array($plugin_path, wp_get_active_and_valid_plugins()) || in_array($plugin_path, wp_get_active_network_plugins()))) {
    echo 'Please install WooCommerce plugin';
    exit;
}

require_once plugin_dir_path(__FILE__) . 'includes/class-woocomanage.php';
require_once plugin_dir_path(__FILE__) . 'includes/rest-functions.php';



new Woocomanage(); 
new Woocomanage_rest_functions();
class Woocomanage_activate
{
    public $plugin_slug;

    public $version;
    public $cache_key;
    public $cache_allowed;
    public function __construct()
    {

        $this->plugin_slug = plugin_basename(__DIR__);
        $this->version = $this-> get_plugin_version();
        $this->cache_allowed = false;

        // Initialize hooks and actions
        // add_filter('plugins_api', array($this, 'info'), 20, 3);
        // add_filter('site_transient_update_plugins', array($this, 'update'));
        // add_action('upgrader_process_complete', array($this, 'purge'), 10, 2);

        register_activation_hook(__FILE__,  array($this, 'activate_plugin'));
        // register_deactivation_hook(__FILE__,  array($this, 'deactivate_plugin'));
    
    }

   public function get_plugin_version() {
        $plugin_data = get_file_data(__FILE__, array('Version' => 'Version'));
        return $plugin_data['Version'];
    }

    public function request()
    {
       // $remote = get_transient( $this->cache_key );

       if (!$this->cache_allowed) {

        $remote = wp_remote_get(
            'https://woocomanage.com/wp-content/uploads/updater/info.json',
            array(
                'timeout' => 10,
                'headers' => array(
                    'Accept' => 'application/json'
                )
            )
        );

        if (
            is_wp_error($remote)
            || 200 !== wp_remote_retrieve_response_code($remote)
            || empty(wp_remote_retrieve_body($remote))
        ) {
            return false;
        }

        // set_transient( $this->cache_key, $remote, DAY_IN_SECONDS );

    }

    $remote = json_decode(wp_remote_retrieve_body($remote));

    return $remote;
    }

    public function info($res, $action, $args)
    {
    // print_r( $action );
        // print_r( $args );

        // do nothing if you're not getting plugin information right now
        if ('plugin_information' !== $action) {
            return $res;
        }

        // do nothing if it is not our plugin
        if ($this->plugin_slug !== $args->slug) {
            return $res;
        }

        // get updates
        $remote = $this->request();

        if (!$remote) {
            return $res;
        }

        $res = new stdClass();

        $res->name = $remote->name;
        $res->slug = $remote->slug;
        $res->version = $remote->version;
        $res->tested = $remote->tested;
        $res->requires = $remote->requires;
        $res->author = $remote->author;
        $res->author_profile = $remote->author_profile;
        $res->download_link = $remote->download_url;
        $res->trunk = $remote->download_url;
        $res->requires_php = $remote->requires_php;
        $res->last_updated = $remote->last_updated;

        $res->sections = array(
            'description' => $remote->sections->description,
            'installation' => $remote->sections->installation,
            'changelog' => $remote->sections->changelog
        );

        if (!empty($remote->banners)) {
            $res->banners = array(
                'low' => $remote->banners->low,
                'high' => $remote->banners->high
            );
        }

        return $res;
    }

    public function update($transient)
    {
        if ( empty($transient->checked ) ) {
        	return $transient;
        }

        $remote = $this->request();

        if (
            $remote
            && version_compare($this->version, $remote->version, '<')
            && version_compare( $remote->requires, get_bloginfo( 'version' ), '<=' )
            && version_compare( $remote->requires_php, PHP_VERSION, '<' )
        ) {
            $res = new stdClass();
            $res->slug = $this->plugin_slug;
            $res->plugin = plugin_basename(__FILE__);
            $res->new_version = $remote->version;
            $res->tested = $remote->tested;
            $res->package = $remote->download_url;
            $transient->response[$res->plugin] = $res;
        }

        return $transient;
    }

    public function purge($upgrader, $options)
    {
        if (
            $this->cache_allowed
            && 'update' === $options['action']
            && 'plugin' === $options['type']
        ) {
            // just clean the cache when new plugin version is installed
            // delete_transient( $this->cache_key );
        }
    }


    public function activate_plugin()
    {
          global $wpdb;
          $table_name = $wpdb->prefix . 'woocomanage';
          $charset_collate = $wpdb->get_charset_collate();
  
          // Check if the table exists and has no data
          $table_exists = $wpdb->get_var("SHOW TABLES LIKE '$table_name'");
          $table_empty = empty($wpdb->get_results("SELECT * FROM $table_name"));
  
          if (!$table_exists || $table_empty) {
              $sql = "CREATE TABLE $table_name (
              id INT NOT NULL AUTO_INCREMENT,
              name text NOT NULL,
              reservedData LONGTEXT NOT NULL,
              PRIMARY KEY (id)
          ) $charset_collate;";
  
              require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
              dbDelta($sql);
  
              $createDataName = array("columnName", "perPage", "size", 'status', 'category', 'tags', 'price', 'color', 'editAll', 'pro', 'y',);
              $createDefaultName = array("hello", "100", "hello", "hello", "hello", "hello", "hello", "hello", "hello", "hello", "hello",);
              // Insert data only if the table is empty
              if ($table_empty) {
                  foreach ($createDataName as $index => $createName) {
                      $wpdb->insert(
                          $table_name,
                          [
                              'name' => $createName,
                              'reservedData' =>  $createDefaultName[$index],
                          ]
                      );
                  }
              }
          }
    }

  public function deactivate_plugin()
    {
        global $wpdb;

        $table_name = $wpdb->prefix . 'woocomanage';

        $wpdb->query("DROP TABLE IF EXISTS $table_name");
    }

}
new Woocomanage_activate();


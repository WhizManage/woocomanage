<?php
class Woocomanage
{
    public $plugin_slug;
    public $version;
    public $cache_key;
    public $cache_allowed;

    public function __construct()
    {
        $this->plugin_slug = plugin_basename(__DIR__);
        $this->version = '0.0.7';
        $this->cache_allowed = false;

        // Initialize hooks and actions
        // add_filter('plugins_api', array($this, 'info'), 20, 3);
        // add_filter('site_transient_update_plugins', array($this, 'update'));
        // add_action('upgrader_process_complete', array($this, 'purge'), 10, 2);
        add_action('admin_menu', array($this, 'create_custom_woocomanage_type'));
        // add_action('rest_api_init', array($this, 'woocomanage_register_rest_route'));
        register_activation_hook(__FILE__,  array($this, 'activate_plugin'));
        // add_action('plugins_loaded',  array($this, 'woocomanage_load_textdomain'));
        // register_deactivation_hook(__FILE__,  array($this, 'deactivate_plugin'));
    }
    public function create_custom_woocomanage_type()
    {
        add_submenu_page(
            'woocommerce',
            __('Woocomanage', 'woocomanage-text'),
            __('Woocomanage', 'textdomain'),
            'manage_options',
            'woocomanage',
            array($this, 'woocomanage_plugin_function')
        );
    }

  public  function woocomanage_plugin_function()
    {
        $this->conduct_admin_enqueue_scripts();
        $this->number_version();
        if (function_exists('acf')) {
            $this->acf_custom();
        }

        require_once plugin_dir_path(__FILE__) . '../templates/app.php';
    }

     function conduct_admin_enqueue_scripts()
    {
        wp_enqueue_style('jobplace-style', plugin_dir_url(__FILE__) . '../build/index.css', null, '1.0.2');
        wp_enqueue_script('jobplace-script', plugin_dir_url(__FILE__) . '../build/index.js', array('wp-element'), '1.0.2', true);
    }

   public  function number_version()
    {
        $plugin_file_path = plugin_dir_path(__FILE__) . '../woocomanage.php'; // Replace 'your-plugin-name.php' with your main plugin file name
        $plugin_data = get_file_data( $plugin_file_path, array( 'Version' => 'Version' ) );
        
        $plugin_version = $plugin_data['Version'];

        $restApi = wp_create_nonce('wp_rest');

        $site_url = get_option('siteurl');

        $user_local = get_user_locale();

        $store_name = get_bloginfo('name');

        echo "<script>
            window.version='$plugin_version'
            window.rest='$restApi'
            window.siteUrl='$site_url'
            window.user_local='$user_local'
            window.store_name='$store_name'
            </script>";
    }
   public function acf_custom()
    {
          // Assuming you are working within a WordPress theme or plugin

        // Get all ACF field groups
        $field_groups = acf_get_field_groups();

        // Initialize an array to store field names and defaults
        $field_data_array = array();

        // Check if there are field groups
        if ($field_groups) {

            foreach ($field_groups as $field_group) {

                $location_matched = false;

                // Check if any member of the location array meets the conditions
                if (isset($field_group['location'][0]) && is_array($field_group['location'][0])) {
                    foreach ($field_group['location'][0] as $location_condition) {
                        if (isset($location_condition['param']) && $location_condition['param'] === 'post_type' && isset($location_condition['value']) && $location_condition['value'] === 'product') {
                            $location_matched = true;
                            break; // Stop checking once a match is found
                        }
                    }
                }

                if ($location_matched) {
                    // Get fields for the current field group
                    $fields = acf_get_fields($field_group);

                    if ($fields) {
                        foreach ($fields as $field) {
                            // Output the field name
                            $fieldName = esc_html($field['name']);
                            $fieldDefault = esc_html($field['default_value']);
                            // Store the field name and default value in the array
                            $field_data_array[] = array(
                                'key' => $fieldName,
                                'value' => $fieldDefault
                            );
                        }
                    } else {
                        echo '<p>No fields found for this group.</p>';
                    }
                }
            }
            $jsonAssociativeArray = json_encode($field_data_array);
            echo "<script>
                window.testObj='$jsonAssociativeArray'
                </script>";
        } else {
            // No ACF field groups found
            echo 'No ACF field groups found';
        }
    }
   


}

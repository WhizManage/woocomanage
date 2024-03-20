<?php
class Woocomanage_rest_functions
{
    public function __construct()
    {
    
        add_action('rest_api_init', array($this, 'woocomanage_register_rest_route'));
    
    }

    public function woocomanage_register_rest_route()
    {
        register_rest_route('woocomanage/v1', '/columns/', array(
            'methods'  => 'POST,GET',
            'callback' =>  array($this, 'post_rest_api_woocomanage'),
            // 'permission_callback' => array($this, 'custom_plugin_check_permissions'),
        ));

        register_rest_route('woocomanage/v1', '/columns/(?P<name>\w+)', array(
            'methods'  => 'PUT,GET',
            'callback' => array($this, 'update_rest_api_woocomanage'),
            // 'permission_callback' => array($this, 'custom_plugin_check_permissions'),
        ));
    }

    public function post_rest_api_woocomanage($request)
    {
        if ($request->get_method() === 'POST') {
            // Handle POST requests
            $dataWooCo = $request->get_json_params();

            // Process the received data (customize this part according to your needs)
            $name = isset($dataWooCo['name']) ? $dataWooCo['name'] : 'No message received';
            $message = isset($dataWooCo['reservedData']) ? $dataWooCo['reservedData'] : 'No message received';

            global $wpdb;
            $wpdb->insert(
                $wpdb->prefix . 'woocomanage',
                [
                    'name' => $name,
                    'reservedData' => json_encode($message)
                ]
            );

            // Your custom logic here
            $response =  $dataWooCo;

            return rest_ensure_response($response);
        } elseif ($request->get_method() === 'GET') {
            // Handle GET requests
            global $wpdb;
            $result = $wpdb->get_results("SELECT * FROM {$wpdb->prefix}woocomanage", ARRAY_A);

            // Deserialize the 'reservedData' data into an array of objects


            foreach ($result as &$row) {
                if ($row['reservedData'][0] === '{') {
                    $row['reservedData'] = json_decode($row['reservedData']);
                }
            }

            return rest_ensure_response($result);
        } else {
            // Handle other request methods if needed
            return rest_ensure_response(array('error' => 'Unsupported request method'));
        }
    }

    public function update_rest_api_woocomanage($request)
    {
        $id = $request->get_param('name');

        if ($request->get_method() === 'PUT') {
            // Handle PUT requests
            $data1 = $request->get_json_params();

            // Process the received data (customize this part according to your needs)
            $message = isset($data1['name']) ? $data1 : 'No message received';

            global $wpdb;
            $wpdb->update(
                $wpdb->prefix . 'woocomanage',
                [
                    'reservedData' => json_encode($message['reservedData'])
                ],
                [
                    'name' => $id
                ]
            );

            $response = $data1;

            return rest_ensure_response($response);
        } elseif ($request->get_method() === 'GET') {
            // Handle GET requests
            global $wpdb;

            $results = $wpdb->get_results(
                $wpdb->prepare("SELECT * FROM {$wpdb->prefix}woocomanage WHERE name = %s", $id),
                ARRAY_A
            );

            foreach ($results as &$row) {
                if ($row['reservedData'][0] === '{') {
                    $row['reservedData'] = json_decode($row['reservedData']);
                }
            }

            return rest_ensure_response($results);
        } else {
            // Handle other request methods if needed
            return rest_ensure_response(array('error' => 'Unsupported request method'));
        }
    }

    public function custom_plugin_check_permissions()
    {
          // Implement custom permission checks here
          return current_user_can('manage_options');
    }

    // Other REST API related methods here...
}

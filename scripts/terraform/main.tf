terraform {
  backend "azurerm" {
    resource_group_name  = "matheus-shared-rg"
    storage_account_name = "matheussharedstorageacc"
    container_name       = "tfstate"
    key                  = "terraform.tfstate"
  }
}

data "azuread_client_config" "current" {}

provider "azurerm" {
  features {}
}

# Create the resource group for the App
resource "azurerm_resource_group" "rg" {
  name     = "${var.resource_group_name}-rg"
  location = var.location
}

# Create the resource group for the Service Plan
resource "azurerm_resource_group" "sharedrg" {
  name     = "${var.shared_resource_group_name}-rg"
  location = var.location
}

# Create the Linux App Service Plan
resource "azurerm_service_plan" "appserviceplan" {
  name                = var.service_plan_name
  location            = var.location
  resource_group_name = azurerm_resource_group.sharedrg.name
  os_type             = "Linux"
  sku_name            = "F1"
}

# Create the Function Linux App Service Plan
resource "azurerm_service_plan" "functionappserviceplan" {
  name                = var.function_service_plan_name
  location            = "France Central"
  resource_group_name = azurerm_resource_group.rg.name
  os_type             = "Linux"
  sku_name            = "Y1"
}


# Create the web app UI
resource "azurerm_linux_web_app" "webapp" {
  name                  = var.ui_app_name
  location              = var.location
  resource_group_name   = azurerm_resource_group.rg.name
  service_plan_id       = azurerm_service_plan.appserviceplan.id
  https_only            = true
  
  site_config { 
    minimum_tls_version = "1.2"
    always_on = false
  
    application_stack {
        docker_registry_username = var.registry_username
        docker_registry_password = var.registry_password
        docker_image_name   = var.ui_image_name
        docker_registry_url = var.registry_url
    } 
  }
}


# Create the web app Api
resource "azurerm_linux_web_app" "webappapi" {
  name                  = var.api_app_name
  location              = var.location
  resource_group_name   = azurerm_resource_group.rg.name
  service_plan_id       = azurerm_service_plan.appserviceplan.id
  https_only            = true
  
  site_config { 
    minimum_tls_version = "1.2"
    always_on = false
  
    application_stack {
        docker_registry_username = var.registry_username
        docker_registry_password = var.registry_password
        docker_image_name   = var.api_image_name
        docker_registry_url = var.registry_url
    } 
  }
}

# Create the storage acc
resource "azurerm_storage_account" "storageacc" {
  name                     = "mpstorageaccv2"
  resource_group_name      = azurerm_resource_group.rg.name
  location                 = azurerm_resource_group.rg.location
  account_tier             = "Standard"
  account_replication_type = "LRS"

  tags = {
    environment = "portfolio"
  }
}

# Create the storage container
resource "azurerm_storage_container" "container" {
  name                  = "portfolio"
  storage_account_name  = azurerm_storage_account.storageacc.name
  container_access_type = "private"
}


# Create the Function Api
resource "azurerm_linux_function_app" "functionapi" {
  name                = "matheus-portfolio-function-api"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location

  storage_account_name       = azurerm_storage_account.storageacc.name
  storage_account_access_key = azurerm_storage_account.storageacc.primary_access_key
  service_plan_id            = azurerm_service_plan.functionappserviceplan.id

  site_config {}
}

# Create Api Management
resource "azurerm_api_management" "portfolioapimgmt" {
  name                = "matheus-portfolio-api-mgmt"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  publisher_name      = "matheus-portfolio-api-mgmt"
  publisher_email     = "matheus.sexto@gmail.com"

  sku_name = "Consumption_0"
}

# Create Api Management Open Api
resource "azurerm_api_management_api" "webapimgmt" {
  name                = "microservice-portfolio"
  resource_group_name = azurerm_resource_group.rg.name
  api_management_name = azurerm_api_management.portfolioapimgmt.name
  revision            = "1"
  display_name        = "Microservice Portfolio API"
  protocols           = ["https"]

  import {
    content_format = "openapi-link"
    content_value  = "https://matheus-portfolio-api.azurewebsites.net/swagger/v1/swagger.json"
  }
}

# Create Api Management Function Api
# resource "azurerm_api_management_api" "functionapi" {
#   name                = "Portifolio.FunctionApp"
#   resource_group_name = azurerm_resource_group.rg.name
#   api_management_name = azurerm_api_management.portfolioapimgmt.name
#   revision            = "1"
#   display_name        = "Portifolio.FunctionApp"
#   service_url         = "https://portfolio-api.azure-api.net/function" 
#   protocols           = ["https"]
# }

resource "azurerm_api_management_policy" "portfolioapipolicy" {
  api_management_id = azurerm_api_management.portfolioapimgmt.id
  xml_content = <<XML
<policies>
    <inbound>
        <cors allow-credentials="false">
            <allowed-origins>
                <origin>https://matheus.azurewebsites.net/</origin>
            </allowed-origins>
            <allowed-methods>
                <method>GET</method>
                <method>POST</method>
            </allowed-methods>
        </cors>
        <choose>
            <when condition="@(context.Request.Url.Query.GetValueOrDefault("api") == "function")">
                <set-backend-service base-url="https://portfolio-api.azure-api.net/function/" />
            </when>
        </choose>
    </inbound>
    <backend>
        <forward-request />
    </backend>
    <outbound />
    <on-error />
</policies>
XML
}
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

# Create the web app, pass in the App Service Plan ID
resource "azurerm_linux_web_app" "webapp" {
  name                  = var.app_name
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
        docker_image_name   = var.image_name
        docker_registry_url = var.registry_url
    } 
  }
}
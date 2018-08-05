# -*- mode: ruby -*-
# vi: set ft=ruby sw=2 ts=2 :

Vagrant.configure("2") do |config|
  config.vm.box      = "debian/jessie64"
  config.vm.hostname = "ffujs"

  config.vm.network :private_network, ip: "192.168.17.49"

  config.vm.provider "virtualbox" do |v|
    v.memory = 768
  end

  config.vm.provision :ansible do |a|
    a.playbook = "provision.yml"
    a.extra_vars = {
      ansible_ssh_user: "vagrant",
      ansible_become: "yes",
    }
  end
end

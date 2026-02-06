module.exports = {
  docs: [
    {
      type: 'doc',
      id: 'introduction',
    },
    {
      type: 'doc',
      id: 'installation',
    },
    {
      type: 'category',
      label: 'Usage',
      items: [
        'usage.quick_start',
        'usage.markup',
        'usage.styling',
        'usage.instantiation',
        'usage.interactions',
        'usage.api',
      ],
    },
    {
      type: 'category',
      label: 'Advanced',
      items: [
        'advanced.focus_considerations',
        'advanced.animations',
        'advanced.alert_dialog',
        'advanced.events',
        'advanced.scroll_lock',
        'advanced.nested_dialogs',
      ],
    },
    {
      type: 'category',
      label: 'Further reading',
      items: [
        'further_reading.implementations',
        'further_reading.web_components',
        'further_reading.known_issues',
        'further_reading.dialog_element',
        'further_reading.migrating_to_v7',
        'further_reading.migrating_to_v8',
      ],
    },
  ],
}

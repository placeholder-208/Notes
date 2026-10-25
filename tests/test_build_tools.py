import importlib.util
from pathlib import Path
import tempfile
import unittest


def load_script(name):
    spec = importlib.util.spec_from_file_location(name, Path(__file__).parents[1] / 'scripts' / f'{name}.py')
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


class BuildToolsTest(unittest.TestCase):
    def test_firebase_disabled_without_configuration(self):
        generate = load_script('generate_firebase_config').generate_config
        self.assertEqual(generate({}), {'enabled': False})

    def test_partial_configuration_fails_without_revealing_values(self):
        generate = load_script('generate_firebase_config').generate_config
        with self.assertRaisesRegex(ValueError, 'FIREBASE_AUTH_DOMAIN'):
            generate({'FIREBASE_API_KEY': 'example'})

    def test_special_characters_remain_data(self):
        generate = load_script('generate_firebase_config').generate_config
        value = 'quote" newline\n $(not-a-command)'
        config = generate({key: value for key in ('FIREBASE_API_KEY', 'FIREBASE_AUTH_DOMAIN', 'FIREBASE_PROJECT_ID', 'FIREBASE_APP_ID')})
        self.assertEqual(config['apiKey'], value)

    def test_checker_catches_missing_images_and_fragments(self):
        check = load_script('check_site').check_site
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / 'index.html'
            path.write_text('<a href="#missing">Link</a><img src="/Notes/missing.png">', encoding='utf-8')
            _, errors = check(directory, '/Notes')
            self.assertEqual(len(errors), 2)
            path.write_text('<p id="ok">Text</p><a href="#ok">Link</a>', encoding='utf-8')
            self.assertEqual(check(directory, '/Notes')[1], [])


if __name__ == '__main__':
    unittest.main()

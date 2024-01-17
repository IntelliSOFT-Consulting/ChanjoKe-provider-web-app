import { Disclosure } from '@headlessui/react'
import { MinusSmallIcon, PlusSmallIcon } from '@heroicons/react/24/outline'

const faqs = [
  {
    question: "What are the side effects of vaccination?",
    answer:
      "Pain, swelling at site of injection, slight fever, nausea, mild headaches.",
  },
  {
    question: "When am I supposed to come for my second dose?",
    answer:
      "It depends on the type of vaccination given.",
  },
  {
    question: "Is vaccination painful?",
    answer:
      "It is slightly painful.",
  },
  {
    question: "Which vaccine am I going to receive?",
    answer:
      "It depends on age, availability of the vaccine and ANC mothers.",
  },
  {
    question: "When am I supposed to come back for the second dose?",
    answer:
      "It depends on the type of vaccine.",
  },
  {
    question: "Can I be vaccinated when unwell?",
    answer:
      "Yes.",
  },
  {
    question: "Can I take a second dose / booster of a different vaccine?",
    answer:
      "Yes.",
  },
  {
    question: "Am I supposed to take any drugs in case of a reaction?",
    answer:
      "No, visit the nearest health facility.",
  },
  {
    question: "Can I get vaccinated in another facility?",
    answer:
      "Yes.",
  },
]

export default function FAQs() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-20 mt-10">
        <div className="mx-auto max-w-4xl divide-y divide-gray-900/10">
          <h2 className="text-2xl font-bold leading-10 tracking-tight text-[#163C94]">Frequently asked questions</h2>
          <dl className="mt-10 space-y-6 divide-y divide-gray-900/10">
            {faqs.map((faq) => (
              <Disclosure as="div" key={faq.question} className="pt-6">
                {({ open }) => (
                  <>
                    <dt>
                      <Disclosure.Button className="flex w-full items-start justify-between text-left text-gray-900">
                        <span className="text-base font-semibold leading-7">{faq.question}</span>
                        <span className="ml-6 flex h-7 items-center">
                          {open ? (
                            <MinusSmallIcon className="h-6 w-6" aria-hidden="true" />
                          ) : (
                            <PlusSmallIcon className="h-6 w-6" aria-hidden="true" />
                          )}
                        </span>
                      </Disclosure.Button>
                    </dt>
                    <Disclosure.Panel as="dd" className="mt-2 pr-12">
                      <p className="text-base leading-7 text-gray-600">{faq.answer}</p>
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}